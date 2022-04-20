// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

// ============ Imports ============
// TODO: import from nomad, summa packages
import {TypedMemView} from "../../../nomad-core/libs/TypedMemView.sol";
import {Home} from "../../../nomad-core/contracts/Home.sol";
import {Version0} from "../../../nomad-core/contracts/Version0.sol";
import {TypeCasts} from "../../../nomad-core/contracts/XAppConnectionManager.sol";
import {Router} from "../Router.sol";

import {ConnextMessage} from "./ConnextMessage.sol";

import {AssetLogic} from "../../../lib/Connext/AssetLogic.sol";
import {ConnextUtils} from "../../../lib/Connext/ConnextUtils.sol";
import {LibCrossDomainProperty} from "../../../lib/LibCrossDomainProperty.sol";

import {IBridgeToken} from "../../interfaces/bridge/IBridgeToken.sol";
import {ITokenRegistry} from "../../interfaces/bridge/ITokenRegistry.sol";

import {IWrapped} from "../../../interfaces/IWrapped.sol";
import {IConnext} from "../../../interfaces/IConnext.sol";
import {IExecutor} from "../../../interfaces/IExecutor.sol";
import {IStableSwap} from "../../../interfaces/IStableSwap.sol";

import {Executor} from "../../../interpreters/Executor.sol";

import {ProposedOwnableUpgradeable} from "../../../ProposedOwnableUpgradeable.sol";
import {RouterPermissionsManager} from "../../../RouterPermissionsManager.sol";

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/**
 * @title ConnextHandler
 * @author Connext Labs
 * @dev Contains logic to facilitate bridging via nomad, including the provision of
 * fast liquidity
 */
contract ConnextHandler is
  Initializable,
  Version0,
  ReentrancyGuardUpgradeable,
  Router,
  RouterPermissionsManager,
  IConnext
{
  // ============ Libraries ============

  using TypedMemView for bytes;
  using TypedMemView for bytes29;
  using ConnextMessage for bytes29;
  using SafeERC20Upgradeable for IERC20Upgradeable;

  // ============ Constants ============

  // TODO: enable setting these constants via admin fn
  uint256 public LIQUIDITY_FEE_NUMERATOR;
  uint256 public LIQUIDITY_FEE_DENOMINATOR;

  /**
   * @notice Contains hash of empty bytes
   */
  bytes32 internal EMPTY;

  // ============ Private storage ============
  /**
   * @dev This empty reserved space is put in place to allow future versions to add new
   * variables without shifting down storage in the inheritance chain.
   * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
   */
  uint256[49] private __gap;

  // ============ Public storage ============
  /**
   * @notice The address of the wrapper for the native asset on this domain
   * @dev Needed because the nomad only handles ERC20 assets
   */
  IWrapped public wrapper;

  /**
   * @notice Nonce for the contract, used to keep unique transfer ids.
   * @dev Assigned at first interaction (xcall on origin domain);
   */
  uint256 public nonce;

  /**
   * @notice The external contract that will execute crosschain calldata
   */
  IExecutor public executor;

  /**
   * @notice The domain this contract exists on
   * @dev Must match the nomad domain, which is distinct from the "chainId"
   */
  uint256 public domain;

  /**
   * @notice The local nomad token registry
   */
  ITokenRegistry public tokenRegistry;

  /**
   * @notice Mapping holding the AMMs for swapping in and out of local assets
   * @dev Swaps for an adopted asset <> nomad local asset (i.e. POS USDC <> madUSDC on polygon)
   */
  mapping(bytes32 => IStableSwap) public adoptedToLocalPools;

  /**
   * @notice Mapping of whitelisted assets on same domain as contract
   * @dev Mapping is keyed on the canonical token identifier matching what is stored in the token
   * registry
   */
  mapping(bytes32 => bool) public approvedAssets;

  /**
   * @notice Mapping of canonical to adopted assets on this domain
   * @dev If the adopted asset is the native asset, the keyed address will
   * be the wrapped asset address
   */
  mapping(address => ConnextMessage.TokenId) public adoptedToCanonical;

  /**
   * @notice Mapping of adopted to canonical on this domain
   * @dev If the adopted asset is the native asset, the stored address will be the
   * wrapped asset address
   */
  mapping(bytes32 => address) public canonicalToAdopted;

  /**
   * @notice Mapping to determine if transfer is reconciled
   */
  mapping(bytes32 => bool) public reconciledTransfers;

  /**
   * @notice Mapping holding router address that provided fast liquidity
   */
  mapping(bytes32 => address[]) public routedTransfers;

  /**
   * @notice Mapping of router to available balance of an asset
   * @dev Routers should always store liquidity that they can expect to receive via the bridge on
   * this domain (the nomad local asset)
   */
  mapping(address => mapping(address => uint256)) public routerBalances;

  /**
   * @notice Mapping of approved relayers
   * @dev Send relayer fee if msg.sender is approvedRelayer. otherwise revert()
   */
  mapping(address => bool) public approvedRelayers;

  /**
   * @notice The max amount of routers a payment can be routed through
   */
  uint256 public maxRoutersPerTransfer;

  // ============ Errors ============

  error ConnextHandler__addRelayer_alreadyApproved();
  error ConnextHandler__removeRelayer_notApproved();
  error ConnextHandler__removeAssetId_notAdded();
  error ConnextHandler__handle_invalidAction();
  error ConnextHandler__execute_unapprovedRelayer();
  error ConnextHandler__execute_alreadyExecuted();
  error ConnextHandler__execute_notSupportedRouter();
  error ConnextHandler__execute_invalidProperties();
  error ConnextHandler__execute_maxRoutersExceeded();
  error ConnextHandler__addLiquidityForRouter_routerEmpty();
  error ConnextHandler__addLiquidityForRouter_amountIsZero();
  error ConnextHandler__addLiquidityForRouter_badRouter();
  error ConnextHandler__addLiquidityForRouter_badAsset();
  error ConnextHandler__setMaxRoutersPerTransfer_invalidMaxRoutersPerTransfer();

  // ========== Initializer ============

  function initialize(
    uint256 _domain,
    address _xAppConnectionManager,
    address _tokenRegistry, // Nomad token registry
    address _wrappedNative
  ) public override initializer {
    __XAppConnectionClient_initialize(_xAppConnectionManager);
    __ReentrancyGuard_init();
    __RouterPermissionsManager_init();

    nonce = 0;
    domain = _domain;
    executor = new Executor(address(this));
    tokenRegistry = ITokenRegistry(_tokenRegistry);
    wrapper = IWrapped(_wrappedNative);
    EMPTY = hex"c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
    LIQUIDITY_FEE_NUMERATOR = 9995;
    LIQUIDITY_FEE_DENOMINATOR = 10000;
    maxRoutersPerTransfer = 5;
  }

  // ============ Owner Functions ============

  /**
   * @notice Used to set router initial properties
   * @param router Router address to setup
   * @param owner Initial Owner of router
   * @param recipient Initial Recipient of router
   */
  function setupRouter(
    address router,
    address owner,
    address recipient
  ) external onlyOwner {
    _setupRouter(router, owner, recipient);
  }

  /**
   * @notice Used to remove routers that can transact crosschain
   * @param router Router address to remove
   */
  function removeRouter(address router) external override onlyOwner {
    _removeRouter(router);
  }

  /**
   * @notice Adds a stable swap pool for the local <> adopted asset.
   */
  function addStableSwapPool(ConnextMessage.TokenId calldata canonical, address stableSwapPool)
    external
    override
    onlyOwner
  {
    ConnextUtils.addStableSwapPool(canonical, stableSwapPool, adoptedToLocalPools);
  }

  /**
   * @notice Used to add supported assets. This is an admin only function
   * @dev When whitelisting the canonical asset, all representational assets would be
   * whitelisted as well. In the event you have a different adopted asset (i.e. PoS USDC
   * on polygon), you should *not* whitelist the adopted asset. The stable swap pool
   * address used should allow you to swap between the local <> adopted asset
   * @param canonical - The canonical asset to add by id and domain. All representations
   * will be whitelisted as well
   * @param adoptedAssetId - The used asset id for this domain (i.e. PoS USDC for
   * polygon)
   * @param stableSwapPool - Address of the pool to swap adopted <> local asset
   */
  function setupAsset(
    ConnextMessage.TokenId calldata canonical,
    address adoptedAssetId,
    address stableSwapPool
  ) external override onlyOwner {
    // Add the asset
    ConnextUtils.addAssetId(
      canonical,
      adoptedAssetId,
      address(wrapper),
      approvedAssets,
      adoptedToCanonical,
      canonicalToAdopted
    );

    // Add the swap pool
    ConnextUtils.addStableSwapPool(canonical, stableSwapPool, adoptedToLocalPools);
  }

  /**
   * @notice Used to remove assets from the whitelist
   * @param canonicalId - Token id to remove
   * @param adoptedAssetId - Corresponding adopted asset to remove
   */
  function removeAssetId(bytes32 canonicalId, address adoptedAssetId) external override onlyOwner {
    ConnextUtils.removeAssetId(
      canonicalId,
      adoptedAssetId,
      address(wrapper),
      approvedAssets,
      adoptedToLocalPools,
      adoptedToCanonical
    );
  }

  /**
   * @notice Used to add approved relayer
   * @param relayer - The relayer address to add
   */
  function addRelayer(address relayer) external override onlyOwner {
    ConnextUtils.addRelayer(relayer, approvedRelayers);
  }

  /**
   * @notice Used to remove approved relayer
   * @param relayer - The relayer address to remove
   */
  function removeRelayer(address relayer) external override onlyOwner {
    ConnextUtils.removeRelayer(relayer, approvedRelayers);
  }

  /**
   * @notice Used to set the max amount of routers a payment can be routed through
   * @param newMaxRouters The new max amount of routers
   */
  function setMaxRoutersPerTransfer(uint256 newMaxRouters) external override onlyOwner {
    ConnextUtils.setMaxRoutersPerTransfer(newMaxRouters, maxRoutersPerTransfer);
  }

  // ============ External functions ============

  receive() external payable {}

  /**
   * @notice This is used by anyone to increase a router's available liquidity for a given asset.
   * @dev The liquidity will be held in the local asset, which is the representation if you
   * are *not* on the canonical domain, and the canonical asset otherwise.
   * @param amount - The amount of liquidity to add for the router
   * @param local - The address of the asset you're adding liquidity for. If adding liquidity of the
   * native asset, routers may use `address(0)` or the wrapped asset
   * @param router The router you are adding liquidity on behalf of
   */
  function addLiquidityFor(
    uint256 amount,
    address local,
    address router
  ) external payable override nonReentrant {
    _addLiquidityForRouter(amount, local, router);
  }

  /**
   * @notice This is used by any router to increase their available liquidity for a given asset.
   * @dev The liquidity will be held in the local asset, which is the representation if you
   * are *not* on the canonical domain, and the canonical asset otherwise.
   * @param amount - The amount of liquidity to add for the router
   * @param local - The address of the asset you're adding liquidity for. If adding liquidity of the
   * native asset, routers may use `address(0)` or the wrapped asset
   */
  function addLiquidity(uint256 amount, address local) external payable override nonReentrant {
    _addLiquidityForRouter(amount, local, msg.sender);
  }

  /**
   * @notice This is used by any router to decrease their available liquidity for a given asset.
   * @param amount - The amount of liquidity to remove for the router
   * @param local - The address of the asset you're removing liquidity from. If removing liquidity of the
   * native asset, routers may use `address(0)` or the wrapped asset
   * @param to The address that will receive the liquidity being removed
   */
  function removeLiquidity(
    uint256 amount,
    address local,
    address payable to
  ) external override nonReentrant {
    // transfer to specicfied recipient IF recipient not set
    address _recipient = routerRecipients(msg.sender);
    _recipient = _recipient == address(0) ? to : _recipient;

    ConnextUtils.removeLiquidity(amount, local, _recipient, routerBalances, wrapper);
  }

  function xcall(XCallArgs calldata _args) external payable override returns (bytes32) {
    // get remote BridgeRouter address; revert if not found
    bytes32 _remote = _mustHaveRemote(_args.params.destinationDomain);

    ConnextUtils.xCallLibArgs memory libArgs = ConnextUtils.xCallLibArgs({
      xCallArgs: _args,
      wrapper: wrapper,
      nonce: nonce,
      tokenRegistry: tokenRegistry,
      domain: domain,
      home: xAppConnectionManager.home(),
      remote: _remote
    });

    (bytes32 _transferId, uint256 newNonce) = ConnextUtils.xcall(libArgs, adoptedToCanonical, adoptedToLocalPools);

    nonce = newNonce;

    return _transferId;
  }

  /**
   * @notice Handles an incoming message
   * @dev This function relies on nomad relayers and should not consume arbitrary amounts of
   * gas
   * @param _origin The origin domain
   * @param _nonce The unique identifier for the message from origin to destination
   * @param _sender The sender address
   * @param _message The message
   */
  // ROUTER
  function handle(
    uint32 _origin,
    uint32 _nonce,
    bytes32 _sender,
    bytes memory _message
  ) external override onlyReplica onlyRemoteRouter(_origin, _sender) {
    // handle the action
    ConnextUtils.reconcile(_origin, _message, reconciledTransfers, tokenRegistry, routedTransfers, routerBalances);
  }

  /**
   * @notice Called on the destination domain to disburse correct assets to end recipient
   * and execute any included calldata
   * @dev Can be called prior to or after `handle`, depending if fast liquidity is being
   * used.
   */
  function execute(ExecuteArgs calldata _args) external override returns (bytes32 transferId) {
    // ensure accepted relayer
    if (!approvedRelayers[msg.sender]) {
      revert ConnextHandler__execute_unapprovedRelayer();
    }

    if (_args.routers.length > maxRoutersPerTransfer) revert ConnextHandler__execute_maxRoutersExceeded();

    // get token id
    (uint32 _tokenDomain, bytes32 _tokenId) = tokenRegistry.getTokenId(_args.local);

    // get the transferId
    bytes32 _transferId = ConnextUtils.getTransferId(
      _args.nonce,
      _args.params,
      _args.originSender,
      _tokenDomain,
      _tokenId,
      _args.amount
    );

    // require this transfer has not already been executed
    // NOTE: in slow liquidity path, the router should *never* be filled
    if (routedTransfers[_transferId].length != 0) {
      revert ConnextHandler__execute_alreadyExecuted();
    }

    // get reconciled record
    bool _reconciled = reconciledTransfers[_transferId];

    // check to see if the transfer was reconciled
    (uint256 _amount, address _adopted) = _handleExecuteLiquidity(_transferId, _args, !_reconciled);

    // TODO: payout relayer fee

    // execute the the transaction
    if (keccak256(_args.params.callData) == EMPTY) {
      // no call data, send funds to the user
      AssetLogic.transferAssetFromContract(_adopted, _args.params.to, _amount, wrapper);
    } else {
      // execute calldata w/funds
      AssetLogic.transferAssetFromContract(_adopted, address(executor), _amount, wrapper);
      executor.execute(
        _transferId,
        _amount,
        payable(_args.params.to),
        _adopted,
        _reconciled
          ? LibCrossDomainProperty.formatDomainAndSenderBytes(_args.params.originDomain, _args.originSender)
          : LibCrossDomainProperty.EMPTY_BYTES,
        _args.params.callData
      );
    }

    // emit event
    emit Executed(_transferId, _args.params.to, _args, _adopted, _amount, msg.sender);

    return _transferId;
  }

  // ============ Internal functions ============

  /**
   * @notice Contains the logic to verify + increment a given routers liquidity
   * @dev The liquidity will be held in the local asset, which is the representation if you
   * are *not* on the canonical domain, and the canonical asset otherwise.
   * @param _amount - The amount of liquidity to add for the router
   * @param _local - The address of the nomad representation of the asset
   * @param _router - The router you are adding liquidity on behalf of
   */
  // CU
  function _addLiquidityForRouter(
    uint256 _amount,
    address _local,
    address _router
  ) internal {
    // Sanity check: router is sensible
    if (_router == address(0)) revert ConnextHandler__addLiquidityForRouter_routerEmpty();

    // Sanity check: nonzero amounts
    if (_amount == 0) revert ConnextHandler__addLiquidityForRouter_amountIsZero();

    // Get the canonical asset id from the representation
    (, bytes32 id) = tokenRegistry.getTokenId(_local == address(0) ? address(wrapper) : _local);

    // Router is approved
    // if (!isRouterOwnershipRenounced() && !routerInfo.approvedRouters[_router])
    //   revert ConnextHandler__addLiquidityForRouter_badRouter();

    // // Asset is approved
    // if (!isAssetOwnershipRenounced() && !approvedAssets[id]) revert ConnextHandler__addLiquidityForRouter_badAsset();

    // Transfer funds to coethWithErcTransferact
    (address _asset, uint256 _received) = AssetLogic.transferAssetToContract(_local, _amount, wrapper);

    // Update the router balances. Happens after pulling funds to account for
    // the fee on transfer tokens
    routerBalances[_router][_asset] += _received;

    // Emit event
    emit LiquidityAdded(_router, _asset, id, _received, msg.sender);
  }

  // TODO: move to ConnextUtils
  function _handleExecuteLiquidity(
    bytes32 _transferId,
    ExecuteArgs calldata _args,
    bool isFast
  ) internal returns (uint256, address) {
    uint256 _toSwap = _args.amount;
    uint256 _pathLen = _args.routers.length;
    if (isFast) {
      // this is the fast liquidity path
      // ensure the router is whitelisted

      // calculate amount with fast liquidity fee
      _toSwap = ConnextUtils.getFastTransferAmount(_args.amount, LIQUIDITY_FEE_NUMERATOR, LIQUIDITY_FEE_DENOMINATOR);

      // TODO: validate routers signature on path / transferId

      // store the routers address
      routedTransfers[_transferId] = _args.routers;

      // for each router, assert they are approved, and deduct liquidity
      uint256 _routerAmount = _toSwap / _pathLen;
      for (uint256 i; i < _pathLen; ) {
        // while theres no way for a router to have sufficient liquidity
        // if they have never been approved, this check ensures they weren't
        // removed from the whitelist
        if (!routerInfo.approvedRouters[_args.routers[i]]) {
          revert ConnextHandler__execute_notSupportedRouter();
        }

        // decrement routers liquidity
        routerBalances[_args.routers[i]][_args.local] -= _routerAmount;

        unchecked {
          i++;
        }
      }
    } else {
      // this is the slow liquidity path

      // save a dummy address for the router to ensure the transfer is not able
      // to be executed twice
      // TODO: better ways to enforce this safety check?
      routedTransfers[_transferId] = [address(1)];
    }

    // TODO: payout relayer fee

    // swap out of mad* asset into adopted asset if needed
    (uint256 _amount, address _adopted) = ConnextUtils.swapFromLocalAssetIfNeeded(
      canonicalToAdopted,
      adoptedToLocalPools,
      tokenRegistry,
      _args.local,
      _toSwap
    );

    return (_amount, _adopted);
  }
}
