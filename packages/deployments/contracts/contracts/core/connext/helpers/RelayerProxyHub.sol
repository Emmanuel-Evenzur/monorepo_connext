// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.17;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {GelatoRelayFeeCollector} from "@gelatonetwork/relay-context/contracts/GelatoRelayFeeCollector.sol";

import {ProposedOwnable} from "../../../shared/ProposedOwnable.sol";
import {IRootManager} from "../../../messaging/interfaces/IRootManager.sol";
import {RelayerProxy} from "./RelayerProxy.sol";

interface IGnosisHubConnector {
  struct GnosisRootMessageData {
    bytes _data;
    bytes _signatures;
  }

  function executeSignatures(bytes memory _data, bytes memory _signatures) external;
}

interface IArbitrumHubConnector {
  struct L2Message {
    address l2Sender;
    address to;
    uint256 l2Block;
    uint256 l1Block;
    uint256 l2Timestamp;
    uint256 value;
    bytes callData;
  }

  struct ArbitrumRootMessageData {
    uint64 _nodeNum;
    bytes32 _sendRoot;
    bytes32 _blockHash;
    bytes32[] _proof;
    uint256 _index;
    L2Message _message;
  }

  function processMessageFromRoot(
    uint64 _nodeNum,
    bytes32 _sendRoot,
    bytes32 _blockHash,
    bytes32[] calldata _proof,
    uint256 _index,
    L2Message calldata _message
  ) external;
}

interface IOptimismHubConnector {
  // modified from: https://github.com/ethereum-optimism/optimism/blob/fcfcf6e7e69801e63904ec53815db01a8d45dcac/packages/contracts/contracts/libraries/codec/Lib_OVMCodec.sol#L34-L40
  struct ChainBatchHeader {
    uint256 batchIndex;
    bytes32 batchRoot;
    uint256 batchSize;
    uint256 prevTotalElements;
    bytes extraData;
  }

  // modified from: https://github.com/ethereum-optimism/optimism/blob/fcfcf6e7e69801e63904ec53815db01a8d45dcac/packages/contracts/contracts/libraries/codec/Lib_OVMCodec.sol#L42-L45
  struct ChainInclusionProof {
    uint256 index;
    bytes32[] siblings;
  }

  // modified from: https://github.com/ethereum-optimism/optimism/blob/fcfcf6e7e69801e63904ec53815db01a8d45dcac/packages/contracts/contracts/L1/messaging/IL1CrossDomainMessenger.sol#L18-L24
  struct L2MessageInclusionProof {
    bytes32 stateRoot;
    ChainBatchHeader stateRootBatchHeader;
    ChainInclusionProof stateRootProof;
    bytes stateTrieWitness;
    bytes storageTrieWitness;
  }

  struct OptimismRootMessageData {
    address _target;
    address _sender;
    bytes _message;
    uint256 _messageNonce;
    L2MessageInclusionProof _proof;
  }

  function processMessageFromRoot(
    address _target,
    address _sender,
    bytes memory _message,
    uint256 _messageNonce,
    L2MessageInclusionProof memory _proof
  ) external;
}

interface IPolygonHubConnector {
  function receiveMessage(bytes memory inputData) external;
}

interface IZkSyncHubConnector {
  struct ZkSyncRootMessageData {
    uint32 _l2BlockNumber;
    uint256 _l2MessageIndex;
    uint16 _l2TxNumberInBlock;
    bytes _message;
    bytes32[] _proof;
  }

  function processMessageFromRoot(
    // zkSync block number in which the message was sent
    uint32 _l2BlockNumber,
    // Message index, that can be received via API
    uint256 _l2MessageIndex,
    // The L2 transaction number in a block, in which the log was sent
    uint16 _l2TxNumberInBlock,
    // The message that was sent from l2
    bytes calldata _message,
    // Merkle proof for the message
    bytes32[] calldata _proof
  ) external;
}

/**
 * @title RelayerProxyHub
 * @author Connext Labs, Inc.
 * @notice This is a temporary contract that wraps the Connext RootManager's propagate() function so that it can be called by
 * Gelato's legacy relayer network. The contract stores native assets and pays them to the relayer on function call.
 */
contract RelayerProxyHub is RelayerProxy {
  // ============ Properties ============

  IRootManager public rootManager;
  uint256 public propagateCooldown;
  // Timestamp of the last time the job was worked.
  uint256 public lastPropagateAt;
  mapping(uint32 => mapping(bytes32 => bool)) public processedRootMessages;
  mapping(uint32 => address) public hubConnectors;

  // ============ Events ============
  event RootManagerChanged(address rootManager, address oldRootManager);
  event PropagateCooldownChanged(uint256 propagateCooldown, uint256 oldPropagateCooldown);
  event HubConnectorChanged(address hubConnector, address oldHubConnector, uint32 chain);

  // ============ Constructor ============

  /**
   * @notice Creates a new RelayerProxyHub instance.
   * @param _connext The address of the Connext on this domain.
   * @param _spokeConnector The address of the SpokeConnector on this domain.
   * @param _gelatoRelayer The address of the Gelato relayer on this domain.
   * @param _feeCollector The address of the Gelato Fee Collector on this domain.
   * @param _rootManager The address of the Root Manager on this domain.
   */
  constructor(
    address _connext,
    address _spokeConnector,
    address _gelatoRelayer,
    address _feeCollector,
    address _rootManager,
    address _keep3r,
    uint256 _propagateCooldown,
    address[] memory _hubConnectors,
    uint32[] memory _hubConnectorChains
  ) RelayerProxy(_connext, _spokeConnector, _gelatoRelayer, _feeCollector, _keep3r) {
    _setRootManager(_rootManager);
    _setPropagateCooldown(_propagateCooldown);
    for (uint256 i = 0; i < _hubConnectors.length; i++) {
      _setHubConnector(_hubConnectors[i], _hubConnectorChains[i]);
    }
  }

  // ============ Admin Functions ============

  /**
   * @notice Updates the RootManager address.
   * @param _rootManager The address of the new RootManager on this domain.
   */
  function setRootManager(address _rootManager) external onlyOwner definedAddress(_rootManager) {
    _setRootManager(_rootManager);
  }

  function setPropagateCooldown(uint256 _propagateCooldown) external onlyOwner {
    _setPropagateCooldown(_propagateCooldown);
  }

  function setHubConnector(address _hubConnector, uint32 _chain) external onlyOwner definedAddress(_hubConnector) {
    _setHubConnector(_hubConnector, _chain);
  }

  // ============ External Functions ============

  /**
   * @notice Wraps the call to propagate() on RootManager and pays either the caller or hardcoded relayer
   * from this contract's balance for completing the transaction.
   *
   * @param _connectors Array of connectors: should match exactly the array of `connectors` in storage;
   * used here to reduce gas costs, and keep them static regardless of number of supported domains.
   * @param _messageFees Array of fees in native token for an AMB if required
   * @param _encodedData Array of encodedData: extra params for each AMB if required
   * @param _relayerFee Fee to be paid to relayer
   */
  function propagate(
    address[] calldata _connectors,
    uint256[] calldata _messageFees,
    bytes[] memory _encodedData,
    uint256 _relayerFee
  ) external onlyRelayer nonReentrant {
    uint256 sum = _propagate(_connectors, _messageFees, _encodedData);
    emit FundsDeducted(sum, address(this).balance);
    transferRelayerFee(_relayerFee);
  }

  // Returns a boolean that indicates if a job is workable or not.
  function propagateWorkable() public view returns (bool _isWorkable) {
    return block.timestamp > (lastPropagateAt + propagateCooldown);
  }

  function propagateKeep3r(
    address[] calldata _connectors,
    uint256[] calldata _messageFees,
    bytes[] memory _encodedData
  ) external validateAndPayWithCredits(msg.sender) nonReentrant {
    require(propagateWorkable(), "Job is not workable");
    _propagate(_connectors, _messageFees, _encodedData);
    lastPropagateAt = block.timestamp;
  }

  // ============ Internal Functions ============
  function _setRootManager(address _rootManager) internal {
    emit RootManagerChanged(_rootManager, address(rootManager));
    rootManager = IRootManager(_rootManager);
  }

  function _setPropagateCooldown(uint256 _propagateCooldown) internal {
    emit PropagateCooldownChanged(_propagateCooldown, propagateCooldown);
    propagateCooldown = _propagateCooldown;
  }

  function _setHubConnector(address _hubConnector, uint32 chain) internal {
    emit HubConnectorChanged(_hubConnector, hubConnectors[chain], chain);
    hubConnectors[chain] = _hubConnector;
  }

  function _propagate(
    address[] calldata _connectors,
    uint256[] calldata _messageFees,
    bytes[] memory _encodedData
  ) internal returns (uint256) {
    uint256 sum = 0;
    uint256 length = _connectors.length;
    for (uint32 i; i < length; ) {
      sum += _messageFees[i];
      unchecked {
        ++i;
      }
    }

    rootManager.propagate{value: sum}(_connectors, _messageFees, _encodedData);
    return sum;
  }

  function _processFromRoot(bytes calldata encodedData, uint32 fromChain, bytes32 l2Hash) internal {
    require(!processedRootMessages[fromChain][l2Hash], "Already processed");
    require(hubConnectors[fromChain] != address(0), "No hub connector");

    if (fromChain == 100 || fromChain == 10200) {
      IGnosisHubConnector.GnosisRootMessageData memory data = abi.decode(
        encodedData,
        (IGnosisHubConnector.GnosisRootMessageData)
      );
      IGnosisHubConnector(hubConnectors[fromChain]).executeSignatures(data._data, data._signatures);
    }

    if (fromChain == 42161 || fromChain == 421613) {
      IArbitrumHubConnector.ArbitrumRootMessageData memory data = abi.decode(
        encodedData,
        (IArbitrumHubConnector.ArbitrumRootMessageData)
      );
      IArbitrumHubConnector(hubConnectors[fromChain]).processMessageFromRoot(
        data._nodeNum,
        data._sendRoot,
        data._blockHash,
        data._proof,
        data._index,
        data._message
      );
    }

    if (fromChain == 10 || fromChain == 420) {
      IOptimismHubConnector.OptimismRootMessageData memory data = abi.decode(
        encodedData,
        (IOptimismHubConnector.OptimismRootMessageData)
      );
      IOptimismHubConnector(hubConnectors[fromChain]).processMessageFromRoot(
        data._target,
        data._sender,
        data._message,
        data._messageNonce,
        data._proof
      );
    }

    if (fromChain == 324 || fromChain == 280) {
      IZkSyncHubConnector.ZkSyncRootMessageData memory data = abi.decode(
        encodedData,
        (IZkSyncHubConnector.ZkSyncRootMessageData)
      );
      IZkSyncHubConnector(hubConnectors[fromChain]).processMessageFromRoot(
        data._l2BlockNumber,
        data._l2MessageIndex,
        data._l2TxNumberInBlock,
        data._message,
        data._proof
      );
    }

    if (fromChain == 137 || fromChain == 80001) {
      IPolygonHubConnector(hubConnectors[fromChain]).receiveMessage(encodedData);
    }

    processedRootMessages[fromChain][l2Hash] = true;
  }
}
