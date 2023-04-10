// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.17;

import {QueueLib} from "../../contracts/messaging/libraries/Queue.sol";
import {ProposedOwnable} from "../../contracts/shared/ProposedOwnable.sol";
import {RootManager} from "../../contracts/messaging/RootManager.sol";
import {ProposedOwnable} from "../../contracts/shared/ProposedOwnable.sol";
import {DomainIndexer} from "../../contracts/messaging/libraries/DomainIndexer.sol";
import {IHubConnector} from "../../contracts/messaging/interfaces/IHubConnector.sol";
import {MerkleTreeManager} from "../../contracts/messaging/MerkleTreeManager.sol";
import {WatcherManager} from "../../contracts/messaging/WatcherManager.sol";

import "../utils/ConnectorHelper.sol";

contract ReverterConnector {
  function sendMessage(bytes memory _data) external {
    revert("revert");
  }
}

contract RootManagerForTest is DomainIndexer, RootManager {
  using QueueLib for QueueLib.Queue;

  constructor(
    uint256 _delayBlocks,
    address _merkle,
    address _watcherManager
  ) RootManager(_delayBlocks, _merkle, _watcherManager) {}

  function forTest_setLastCountBeforeOpMode(uint256 _lastCountBeforeOpMode) public {
    lastCountBeforeOpMode = _lastCountBeforeOpMode;
  }

  function forTest_setProposer(address _proposer, bool _isProposer) public {
    allowlistedProposers[_proposer] = _isProposer;
  }

  function forTest_setOptimisticMode(bool _mode) public {
    optimisticMode = _mode;
  }

  function forTest_addInboundRootToQueue(bytes32 _inbound) public {
    pendingInboundRoots.enqueue(_inbound);
  }

  function forTest_generateAndAddDomains(uint32[] memory _domains, address[] memory _connectors) public {
    for (uint256 i; i < _domains.length; i++) {
      addDomain(_domains[i], _connectors[i]);
    }
  }

  function forTest_setProposeData(bytes32 _aggregateRoot, uint256 _endOfDispute) public {
    proposedAggregateRoot = ProposedData(_endOfDispute, _aggregateRoot);
  }

  function forTest_setFinalizedOptimisticRoot(bytes32 _aggregateRoot) public {
    finalizedOptimisticAggregateRoot = _aggregateRoot;
  }

  function forTest_optimisticPropagate(
    address[] calldata _connectors,
    uint256[] calldata _fees,
    bytes[] memory _encodedData
  ) public {
    _optimisticPropagate(_connectors, _fees, _encodedData);
  }

  function forTest_slowPropagate(
    address[] calldata _connectors,
    uint256[] calldata _fees,
    bytes[] memory _encodedData
  ) public {
    _slowPropagate(_connectors, _fees, _encodedData);
  }

  function forTest_sendRootToHubs(
    bytes32 _aggregateRoot,
    address[] calldata _connectors,
    uint256[] calldata _fees,
    bytes[] memory _encodedData
  ) public {
    _sendRootToHubs(_aggregateRoot, _connectors, _fees, _encodedData);
  }

  function forTest_setDomains(uint32[] memory _domains) public {
    domains = _domains;
  }

  function forTest_setLastPropagatedRoot(bytes32 _root) public {
    lastPropagatedRoot = _root;
  }

  function forTest_pause() public {
    _pause();
  }
}

contract Base is ForgeHelper {
  // ============ Errors ============
  error ProposedOwnable__onlyOwner_notOwner();

  // ============ Events ============
  event RootReceived(uint32 domain, bytes32 receivedRoot, uint256 queueIndex);

  event RootsAggregated(bytes32 aggregateRoot, uint256 count, bytes32[] aggregatedMessageRoots);

  event RootPropagated(bytes32 aggregate, uint32[] domains, uint256 count);

  event ConnectorAdded(uint32 domain, address connector, uint32[] domains, address[] connectors);

  event ConnectorRemoved(uint32 domain, address connector, uint32[] domains, address[] connectors, address caller);

  event PropagateFailed(uint32 domain, address connector);

  // ============ Storage ============
  RootManagerForTest _rootManager;
  uint256 _delayBlocks = 40;
  bool _optimisticMode = true;
  uint256 _disputeTime = 30 minutes;
  address _merkle;
  uint32[] _domains;
  address[] _connectors;
  uint256[] _fees;
  bytes[] _encodedData;

  address owner = address(1);
  address watcherManager = address(2);
  address watcher = address(3);
  address proposer = address(4);

  function setUp() public virtual {
    _domains.push(1000);
    _connectors.push(address(1000));
    _fees.push(0);
    _encodedData.push(bytes(""));

    _domains.push(1001);
    _connectors.push(address(1001));
    _fees.push(0);
    _encodedData.push(bytes(""));

    _merkle = address(new MerkleTreeManager());
    MerkleTreeManager(_merkle).initialize(address(_rootManager));

    vm.prank(owner);
    _rootManager = new RootManagerForTest(_delayBlocks, _merkle, watcherManager);
    MerkleTreeManager(_merkle).setArborist(address(_rootManager));

    // Env: roll ahead to an arbitrary block so we don't start at block zero.
    // For dequeuing roots in `propagate`, this will make the delay number we pass in acceptable.
    vm.roll(123456789);
  }

  // ============ Utils ============
  /**
   * @notice Utility to handle generating and adding connector/domain pairs as needed.
   * @param count Num spoke domains TOTAL.
   * @param shouldAggregate Whether to aggregate generated inboundRoots from each domain in this fn.
   * @param willPropagate Whether we should expect propagation to ACTUALLY occur.
   */
  function utils_generateAndAddConnectors(uint256 count, bool shouldAggregate, bool willPropagate) public {
    // Start loop at current domains length so we can skip any already existing.
    for (uint256 i = _domains.length; i < count; i++) {
      // Add another domain/connector pair.
      uint32 domain = uint32(1000 + i);
      _domains.push(domain);
      _connectors.push(address(bytes20(uint160(domain))));
      _fees.push(0);
      _encodedData.push(bytes(""));
    }

    for (uint256 i; i < _domains.length; i++) {
      vm.prank(owner);
      _rootManager.addConnector(_domains[i], _connectors[i]);

      if (shouldAggregate) {
        bytes32 inboundRoot = keccak256(abi.encode(bytes("test"), i));
        vm.prank(_connectors[i]);
        _rootManager.aggregate(_domains[i], inboundRoot);
        console.log("aggregated!", i);
        console.logBytes32(inboundRoot);
      }

      if (willPropagate) {
        // Expect a call to every hub connector!
        vm.mockCall(_connectors[i], abi.encodeWithSelector(IHubConnector.sendMessage.selector), abi.encode());
        vm.expectCall(_connectors[i], abi.encodeWithSelector(IHubConnector.sendMessage.selector));
      }
    }
  }
}

contract RootManager_General is Base {
  // ============ RootManager.addConnector ============
  function test_RootManager__addConnector_shouldWork() public {
    uint32[] memory domains = new uint32[](1);
    address[] memory connectors = new address[](1);
    domains[0] = _domains[0];
    connectors[0] = _connectors[0];
    vm.expectEmit(true, true, true, true);
    emit ConnectorAdded(_domains[0], _connectors[0], domains, connectors);

    vm.prank(owner);
    _rootManager.addConnector(_domains[0], _connectors[0]);

    assertEq(_rootManager.connectors(0), _connectors[0]);
    assertEq(_rootManager.domains(0), _domains[0]);
  }

  function test_RootManager__addConnector_shouldFailIfCallerNotOwner(address caller) public {
    if (caller == owner) {
      // fuzz test, return if owner
      return;
    }

    vm.expectRevert(ProposedOwnable__onlyOwner_notOwner.selector);

    vm.prank(caller);
    _rootManager.addConnector(_domains[0], _connectors[0]);
  }

  function test_RootManager__addConnector_shouldFailIfAlreadyAdded() public {
    vm.prank(owner);
    _rootManager.addConnector(_domains[0], _connectors[0]);

    vm.expectRevert(bytes("domain exists"));

    vm.prank(owner);
    _rootManager.addConnector(_domains[0], _connectors[0]);
  }

  function test_RootManager__addConnector_shouldFailIfDomainAlreadyAdded() public {
    vm.prank(owner);
    _rootManager.addConnector(_domains[0], _connectors[0]);

    vm.expectRevert(bytes("domain exists"));

    vm.prank(owner);
    _rootManager.addConnector(_domains[0], _connectors[1]);
  }

  function test_RootManager__addConnector_shouldFailIfAddressZero() public {
    vm.expectRevert(bytes("!connector"));

    vm.prank(owner);
    _rootManager.addConnector(_domains[0], address(0));
  }

  // ============ RootManager.removeConnector ============
  function test_RootManager__removeConnector_shouldWork() public {
    for (uint256 i; i < 100; i++) {
      vm.startPrank(owner);
      _rootManager.addConnector(_domains[0], _connectors[0]);
      _rootManager.addConnector(_domains[1], _connectors[1]);
      vm.stopPrank();

      uint32[] memory emitted = new uint32[](1);
      address[] memory emittedConnectors = new address[](1);

      emitted[0] = _domains[1];
      emittedConnectors[0] = _connectors[1];
      vm.expectEmit(true, true, true, true);
      emit ConnectorRemoved(_domains[0], _connectors[0], emitted, emittedConnectors, address(this));

      vm.mockCall(
        watcherManager,
        abi.encodeWithSelector(WatcherManager(watcherManager).isWatcher.selector),
        abi.encode(true)
      );

      _rootManager.removeConnector(_domains[0]);

      assertEq(_rootManager.isDomainSupported(_domains[0]), false);

      vm.expectRevert(bytes("!supported"));
      _rootManager.getDomainIndex(_domains[0]);

      vm.expectRevert(bytes("!supported"));
      _rootManager.getConnectorForDomain(_domains[0]);

      // ensure the mappings were properly updated
      assertEq(_rootManager.getDomainIndex(_domains[1]), 0);
      assertEq(_rootManager.getConnectorForDomain(_domains[1]), _connectors[1]);

      _rootManager.removeConnector(_domains[1]);
    }
  }

  function test_RootManager__removeConnector_shouldFailIfCallerNotWatcher() public {
    vm.mockCall(
      watcherManager,
      abi.encodeWithSelector(WatcherManager(watcherManager).isWatcher.selector),
      abi.encode(false)
    );

    vm.expectRevert(bytes("!watcher"));

    _rootManager.removeConnector(_domains[0]);
  }

  function test_RootManager__removeConnector_shouldFailIfNotAdded() public {
    vm.expectRevert(bytes("!supported"));

    vm.mockCall(
      watcherManager,
      abi.encodeWithSelector(WatcherManager(watcherManager).isWatcher.selector),
      abi.encode(true)
    );

    _rootManager.removeConnector(_domains[0]);
  }

  // ============ RootManager.aggregate ============
  function test_RootManager__aggregate_shouldWork(bytes32 inbound) public {
    _rootManager.forTest_setOptimisticMode(false);
    utils_generateAndAddConnectors(1, false, false);

    vm.expectEmit(true, true, true, true);
    emit RootReceived(_domains[0], inbound, 1);

    vm.prank(_connectors[0]);
    _rootManager.aggregate(_domains[0], inbound);
  }

  function test_RootManager__aggregate_shouldFailIfCallerNotConnector(bytes32 inbound) public {
    utils_generateAndAddConnectors(1, false, false);

    vm.expectRevert(bytes("!connector"));

    vm.prank(address(123));
    _rootManager.aggregate(_domains[0], inbound);
  }

  // ============ RootManager.propagate ============
  function test_RootManager__propagate_shouldSendToSpoke(bytes32 inbound) public {
    _rootManager.forTest_setOptimisticMode(false);
    utils_generateAndAddConnectors(1, true, true);

    // Fast forward delayBlocks number of blocks so all of the inbound roots are considered verified.
    vm.roll(block.number + _rootManager.delayBlocks());

    _rootManager.propagate(_connectors, _fees, _encodedData);
  }

  function test_RootManager__propagate_shouldSendToAllSpokes(bytes32 inbound) public {
    _rootManager.forTest_setOptimisticMode(false);
    uint256 numSpokes = 20;
    utils_generateAndAddConnectors(numSpokes, true, true);
    assertEq(_rootManager.getPendingInboundRootsCount(), numSpokes);

    // Fast forward delayBlocks number of blocks so all of the inbound roots are considered verified.
    vm.roll(block.number + _rootManager.delayBlocks());

    _rootManager.propagate(_connectors, _fees, _encodedData);
    assertEq(_rootManager.getPendingInboundRootsCount(), 0);
  }

  function test_RootManager__propagate_shouldRevertIfRedundantRoot(bytes32 inbound) public {
    _rootManager.forTest_setOptimisticMode(false);
    uint256 numSpokes = 20;
    utils_generateAndAddConnectors(numSpokes, true, true);
    assertEq(_rootManager.getPendingInboundRootsCount(), numSpokes);

    // Fast forward delayBlocks number of blocks so all of the inbound roots are considered verified.
    vm.roll(block.number + _rootManager.delayBlocks());

    // Dequeue separately so we can get an updated root.
    _rootManager.dequeue();
    bytes32 currentRoot = MerkleTreeManager(_merkle).root();

    _rootManager.propagate(_connectors, _fees, _encodedData);
    assertEq(_rootManager.lastPropagatedRoot(), currentRoot);

    // The current root has already been sent, the following call should revert since sending
    // again would be redundant.
    vm.expectRevert(bytes("redundant root"));
    _rootManager.propagate(_connectors, _fees, _encodedData);
  }

  function test_RootManager__propagate_shouldNotRevertIfAmbMessageReverts() public {
    _rootManager.forTest_setOptimisticMode(false);
    uint256 numSpokes = 20;
    utils_generateAndAddConnectors(numSpokes, true, true);
    assertEq(_rootManager.getPendingInboundRootsCount(), numSpokes);

    // special case to add reverting connector
    ReverterConnector revertConnector = new ReverterConnector();
    uint32 domain = uint32(1020);
    _domains.push(domain);
    _connectors.push(address(revertConnector));
    _fees.push(0);
    _encodedData.push(bytes(""));

    vm.prank(owner);
    _rootManager.addConnector(_domains[20], address(revertConnector));

    bytes32 inboundRoot = keccak256(abi.encode(bytes("test"), 20));
    vm.prank(address(revertConnector));
    _rootManager.aggregate(_domains[20], inboundRoot);

    vm.expectCall(_connectors[20], abi.encodeWithSelector(IHubConnector.sendMessage.selector));

    assertEq(_rootManager.getPendingInboundRootsCount(), numSpokes + 1);

    // Fast forward delayBlocks number of blocks so all of the inbound roots are considered verified.
    vm.roll(block.number + _rootManager.delayBlocks());

    vm.expectEmit(true, true, true, true);
    emit PropagateFailed(_domains[20], address(revertConnector));

    _rootManager.propagate(_connectors, _fees, _encodedData);
    assertEq(_rootManager.getPendingInboundRootsCount(), 0);
  }
}

contract RootManager_Constructor is Base {
  function test_checkConstructorArguments() public {
    assertEq(_rootManager.DISPUTE_TIME(), _disputeTime);
    assertEq(_rootManager.optimisticMode(), _optimisticMode);
  }
}

contract RootManager_ProposeAggregateRoot is Base {
  event AggregateRootProposed(
    uint256 snapshotId,
    uint256 timestamp,
    bytes32 aggregateRoot,
    bytes32 baseRoot,
    bytes32[] snapshotsRoots,
    uint32[] domains
  );

  function setUp() public virtual override {
    super.setUp();
    _rootManager.forTest_setProposer(proposer, true);
  }

  function test_revertIfCallerIsNotProposer(
    address caller,
    bytes32 aggregateRoot,
    bytes32[] memory snapshotsRoots,
    uint256 snapshotId
  ) public {
    vm.assume(caller != proposer);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_NotWhitelistedProposer.selector, caller));
    vm.prank(caller);
    _rootManager.proposeAggregateRoot(snapshotId, aggregateRoot, snapshotsRoots, _domains);
  }

  function test_revertIfDomainsAreNotValid(
    uint256 snapshotId,
    bytes32 aggregateRoot,
    bytes32[] memory snapshotsRoots,
    uint32[] memory domains
  ) public {
    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_InvalidDomains.selector));
    vm.prank(proposer);
    _rootManager.proposeAggregateRoot(snapshotId, aggregateRoot, snapshotsRoots, domains);
  }

  function test_revertIfSlowModeOn(uint256 snapshotId, bytes32 aggregateRoot, bytes32[] memory snapshotsRoots) public {
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);
    _rootManager.forTest_setOptimisticMode(false);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_SlowModeOn.selector));
    vm.prank(proposer);
    _rootManager.proposeAggregateRoot(snapshotId, aggregateRoot, snapshotsRoots, _domains);
  }

  function test_revertIfSnapshotIdIsNotValid(
    uint256 snapshotId,
    bytes32 aggregateRoot,
    bytes32[] memory snapshotsRoots
  ) public {
    vm.assume(snapshotId != block.timestamp / 30 minutes);

    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_InvalidSnapshotId.selector, snapshotId));
    vm.prank(proposer);
    _rootManager.proposeAggregateRoot(snapshotId, aggregateRoot, snapshotsRoots, _domains);
  }

  function test_revertIfProposeInProgress(bytes32 aggregateRoot, bytes32[] memory snapshotsRoots) public {
    uint256 snapshotId = block.timestamp / _rootManager.SNAPSHOT_DURATION();
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);
    _rootManager.forTest_setProposeData(aggregateRoot, block.timestamp + _rootManager.DISPUTE_TIME());

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_ProposeInProgress.selector));
    vm.prank(proposer);
    _rootManager.proposeAggregateRoot(snapshotId, aggregateRoot, snapshotsRoots, _domains);
  }

  function test_emitProposeAggregateRoot(
    bytes32 aggregateRoot,
    bytes32 baseRoot,
    bytes32[] memory snapshotsRoots
  ) public {
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);
    uint256 snapshotId = block.timestamp / 30 minutes;

    vm.mockCall(_merkle, abi.encodeWithSelector(MerkleTreeManager.root.selector), abi.encode(baseRoot));

    vm.expectEmit(true, true, true, true);
    emit AggregateRootProposed(
      snapshotId,
      block.timestamp + 30 minutes,
      aggregateRoot,
      baseRoot,
      snapshotsRoots,
      _domains
    );

    vm.prank(proposer);
    _rootManager.proposeAggregateRoot(snapshotId, aggregateRoot, snapshotsRoots, _domains);
  }
}

contract RootManager_Finalize is Base {
  event ProposedRootFinalized(bytes32 aggregateRoot);

  function test_revertIfSlowModeOn() public {
    _rootManager.forTest_setOptimisticMode(false);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_SlowModeOn.selector));
    _rootManager.finalize();
  }

  function test_revertIfProposeInProgress(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    _rootManager.forTest_setProposeData(aggregateRoot, block.timestamp + _rootManager.DISPUTE_TIME());

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_ProposeInProgress.selector));
    _rootManager.finalize();
  }

  function test_revertIfAggregateRootDataIsInvalid() public {
    _rootManager.forTest_setProposeData(0, block.timestamp + _rootManager.DISPUTE_TIME());

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_InvalidAggregateRoot.selector));
    _rootManager.finalize();
  }

  function test_createNewLastVerifiedAggregateRoot(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    _rootManager.forTest_setProposeData(aggregateRoot, block.timestamp + _rootManager.DISPUTE_TIME());
    vm.warp(block.timestamp + _disputeTime + 1);

    (, bytes32 beforeAggregateRoot) = _rootManager.proposedAggregateRoot();
    _rootManager.finalize();
    (uint256 afterEndOfDispute, bytes32 afterAggregateRoot) = _rootManager.proposedAggregateRoot();

    bytes32 finalizedAggregateRoot = _rootManager.finalizedOptimisticAggregateRoot();

    assertEq(beforeAggregateRoot, finalizedAggregateRoot);
    assertEq(afterEndOfDispute, 0);
    assertEq(afterAggregateRoot, 0);
  }

  function test_emitIfProposedRootHasFinalized(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    _rootManager.forTest_setProposeData(aggregateRoot, block.timestamp + _rootManager.DISPUTE_TIME());
    vm.warp(block.timestamp + _disputeTime + 1);

    vm.expectEmit(true, true, true, true);
    emit ProposedRootFinalized(aggregateRoot);

    _rootManager.finalize();
  }
}

contract RootManager_ActivateSlowMode is Base {
  event SlowModeActivated();

  function setUp() public virtual override {
    super.setUp();
    _rootManager.forTest_setOptimisticMode(true);

    vm.mockCall(
      watcherManager,
      abi.encodeWithSelector(WatcherManager(watcherManager).isWatcher.selector),
      abi.encode(true)
    );
  }

  function test_revertIfCallerIsNotWatcher(address caller) public {
    vm.mockCall(
      watcherManager,
      abi.encodeWithSelector(WatcherManager(watcherManager).isWatcher.selector),
      abi.encode(false)
    );
    vm.expectRevert(bytes("!watcher"));
    vm.prank(caller);
    _rootManager.activateSlowMode();
  }

  function test_revertIfSlowModeOn() public {
    _rootManager.forTest_setOptimisticMode(false);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_SlowModeOn.selector));
    vm.prank(owner);
    _rootManager.activateSlowMode();
  }

  function test_cleanProposedAggregateRoot(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    uint256 endOfDispute = block.timestamp + _rootManager.DISPUTE_TIME();
    _rootManager.forTest_setProposeData(aggregateRoot, endOfDispute);

    (uint256 beforeEndOfDispute, bytes32 beforeAggregateRoot) = _rootManager.proposedAggregateRoot();
    assertEq(beforeEndOfDispute, endOfDispute);
    assertEq(beforeAggregateRoot, aggregateRoot);

    vm.prank(owner);
    _rootManager.activateSlowMode();

    (uint256 afterEndOfDispute, bytes32 afterAggregateRoot) = _rootManager.proposedAggregateRoot();
    assertEq(afterEndOfDispute, 0);
    assertEq(afterAggregateRoot, 0);
  }

  function test_emitSlowModeActivated() public {
    vm.expectEmit(true, true, true, true);
    emit SlowModeActivated();

    vm.prank(owner);
    _rootManager.activateSlowMode();
  }
}

contract RootManager_ActivateOptimisticMode is Base {
  event OptimisticModeActivated();
  using QueueLib for QueueLib.Queue;

  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfCallerIsNotOwner() public {
    vm.expectRevert(abi.encodeWithSelector(ProposedOwnable.ProposedOwnable__onlyOwner_notOwner.selector));
    _rootManager.activateOptimisticMode();
  }

  function test_revertIfOptimisticModeOn() public {
    _rootManager.forTest_setOptimisticMode(true);
    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_OptimisticModeOn.selector));

    vm.prank(owner);
    _rootManager.activateOptimisticMode();
  }

  function test_optimisticModeIsTrue() public {
    _rootManager.forTest_setOptimisticMode(false);
    bool beforeMode = _rootManager.optimisticMode();

    vm.prank(owner);
    _rootManager.activateOptimisticMode();
    bool afterMode = _rootManager.optimisticMode();

    assertEq(beforeMode, false);
    assertEq(afterMode, true);
  }

  function test_cleanPendingInboundRoots(bytes32 inbound) public {
    vm.assume(inbound > 0);
    _rootManager.forTest_setOptimisticMode(false);
    _rootManager.forTest_addInboundRootToQueue(inbound);
    uint256 pendingInboundsRoots = _rootManager.getPendingInboundRootsCount();
    assertGt(pendingInboundsRoots, 0);

    vm.prank(owner);
    _rootManager.activateOptimisticMode();
    pendingInboundsRoots = _rootManager.getPendingInboundRootsCount();

    assertEq(pendingInboundsRoots, 0);
  }

  function test_merkleCountIsSet() public {
    _rootManager.forTest_setOptimisticMode(false);

    uint256 beforeCount = _rootManager.MERKLE().count();

    vm.prank(owner);
    _rootManager.activateOptimisticMode();

    assertEq(beforeCount, _rootManager.lastCountBeforeOpMode());
  }

  function test_emitIfOptimisticModeIsActivated() public {
    _rootManager.forTest_setOptimisticMode(false);

    vm.expectEmit(true, true, true, true);
    emit OptimisticModeActivated();

    vm.prank(owner);
    _rootManager.activateOptimisticMode();
  }
}

contract RootManager_RemoveConnector is Base {
  function setUp() public virtual override {
    super.setUp();
  }

  function test_deleteProposedAggregateRoot(bytes32 aggregateRoot) public {
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);
    uint256 endOfDispute = block.timestamp + _rootManager.DISPUTE_TIME();
    _rootManager.forTest_setProposeData(aggregateRoot, endOfDispute);

    (uint256 beforeEndOfDispute, bytes32 beforeAggregateRoot) = _rootManager.proposedAggregateRoot();
    assertEq(endOfDispute, beforeEndOfDispute);
    assertEq(beforeAggregateRoot, aggregateRoot);

    vm.mockCall(
      watcherManager,
      abi.encodeWithSelector(WatcherManager(watcherManager).isWatcher.selector),
      abi.encode(true)
    );

    _rootManager.removeConnector(_domains[0]);

    (uint256 afterEndOfDispute, bytes32 afterAggregateRoot) = _rootManager.proposedAggregateRoot();
    assertEq(afterEndOfDispute, 0);
    assertEq(afterAggregateRoot, 0);
  }
}

contract RootManager_Aggregate is Base {
  using QueueLib for QueueLib.Queue;

  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfNotValidConnector(uint8 index, address invalidConnector, bytes32 inbound) public {
    vm.assume(index < _domains.length);
    vm.assume(invalidConnector != _connectors[index]);

    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);
    vm.expectRevert(bytes("!connector"));

    vm.prank(invalidConnector);
    _rootManager.aggregate(_domains[index], inbound);
  }

  function test_revertIfOptimisticModeOn(uint8 index, bytes32 inbound) public {
    vm.assume(index < _domains.length);
    _rootManager.forTest_setOptimisticMode(true);
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_OptimisticModeOn.selector));

    vm.prank(_connectors[index]);
    _rootManager.aggregate(_domains[index], inbound);
  }

  function test_emitIfRootIsReceived(uint8 index, bytes32 inbound) public {
    vm.assume(index < _domains.length);
    _rootManager.forTest_setOptimisticMode(false);
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);

    uint128 lastTreeIndex = uint128(_rootManager.getPendingInboundRootsCount()) + 1;

    vm.expectEmit(true, true, true, true);
    emit RootReceived(_domains[index], inbound, lastTreeIndex);

    vm.prank(_connectors[index]);
    _rootManager.aggregate(_domains[index], inbound);
  }
}

contract RootManager_AddProposer is Base {
  event ProposerAdded(address proposer);

  function test_revertIfCallerIsNotOwner() public {
    vm.expectRevert(abi.encodeWithSelector(ProposedOwnable.ProposedOwnable__onlyOwner_notOwner.selector));
    _rootManager.addProposer(owner);
  }

  function test_addProposer(address proposerToAdd) public {
    vm.prank(owner);
    _rootManager.addProposer(proposerToAdd);
    assertTrue(_rootManager.allowlistedProposers(proposerToAdd));
  }

  function test_emitIfProposerIsAdded(address proposerToAdd) public {
    vm.expectEmit(true, true, true, true);
    emit ProposerAdded(proposerToAdd);

    vm.prank(owner);
    _rootManager.addProposer(proposerToAdd);
  }
}

contract RootManager_RemoveProposer is Base {
  event ProposerRemoved(address proposer);

  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfCallerIsNotOwner() public {
    vm.expectRevert(abi.encodeWithSelector(ProposedOwnable.ProposedOwnable__onlyOwner_notOwner.selector));
    _rootManager.removeProposer(owner);
  }

  function test_removeProposer(address proposerToRemove) public {
    _rootManager.forTest_setProposer(proposerToRemove, true);

    vm.prank(owner);
    _rootManager.removeProposer(proposerToRemove);
    assertFalse(_rootManager.allowlistedProposers(proposerToRemove));
  }

  function test_emitIfProposerIsRemoved(address proposerToRemove) public {
    vm.expectEmit(true, true, true, true);
    emit ProposerRemoved(proposerToRemove);

    vm.prank(owner);
    _rootManager.removeProposer(proposerToRemove);
  }
}

contract RootManager_Propagate is Base {
  event OptimisticRootPropagated(bytes32 aggregateRoot, bytes32 domainsHash);
  event RootPropagated(bytes32 aggregateRoot, uint256 count, bytes32 domainsHash);

  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfInvalidLengthsIfDifferentFeesAmounts(uint256[] calldata randomFees) public {
    vm.assume(randomFees.length != _connectors.length);
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);

    vm.expectRevert(bytes("invalid lengths"));
    _rootManager.propagate(_connectors, randomFees, _encodedData);
  }

  function test_revertIfInvalidLengthsIfDifferentDatasAmounts(bytes[] calldata randomEncodedData) public {
    vm.assume(randomEncodedData.length != _connectors.length);
    _rootManager.forTest_generateAndAddDomains(_domains, _connectors);

    vm.expectRevert(bytes("invalid lengths"));
    _rootManager.propagate(_connectors, _fees, randomEncodedData);
  }

  function test_callOptimisticPropagateFunction(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    _rootManager.forTest_setOptimisticMode(true);
    _rootManager.forTest_setFinalizedOptimisticRoot(aggregateRoot);

    utils_generateAndAddConnectors(_connectors.length, false, true);

    bytes32 _domainsHash = _rootManager.domainsHash();

    vm.expectEmit(true, true, true, true);
    emit OptimisticRootPropagated(aggregateRoot, _domainsHash);

    _rootManager.propagate(_connectors, _fees, _encodedData);
  }

  function test_callSlowPropagateFunction(bytes32 aggregateRoot, uint256 count) public {
    vm.assume(aggregateRoot > 0 && count > _rootManager.lastCountBeforeOpMode());
    _rootManager.forTest_setOptimisticMode(false);

    utils_generateAndAddConnectors(_connectors.length, false, true);

    bytes32 _domainsHash = _rootManager.domainsHash();

    vm.expectEmit(true, true, true, true);
    emit RootPropagated(aggregateRoot, count, _domainsHash);

    vm.mockCall(
      _merkle,
      abi.encodeWithSelector(MerkleTreeManager.rootAndCount.selector),
      abi.encode(aggregateRoot, count)
    );

    _rootManager.propagate(_connectors, _fees, _encodedData);
  }
}

contract RootManager_OptimisticPropagate is Base {
  event OptimisticRootPropagated(bytes32 aggregateRoot, bytes32 domainsHash);

  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfEmptyFinalizedOptimisticRoot() public {
    _rootManager.forTest_setFinalizedOptimisticRoot(bytes32(0));

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_EmptyFinalizedOptimisticRoot.selector));
    _rootManager.forTest_optimisticPropagate(_connectors, _fees, _encodedData);
  }

  function test_deleteFinalizedData(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    _rootManager.forTest_setFinalizedOptimisticRoot(aggregateRoot);

    utils_generateAndAddConnectors(_connectors.length, false, true);
    _rootManager.forTest_optimisticPropagate(_connectors, _fees, _encodedData);

    bytes32 _afterFinalizedRoot = _rootManager.finalizedOptimisticAggregateRoot();
    assertEq(_afterFinalizedRoot, 0);
  }

  function test_emitEventOptimisticRootPropagated(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    _rootManager.forTest_setFinalizedOptimisticRoot(aggregateRoot);

    utils_generateAndAddConnectors(_connectors.length, false, true);

    bytes32 _domainsHash = _rootManager.domainsHash();

    vm.expectEmit(true, true, true, true);
    emit OptimisticRootPropagated(aggregateRoot, _domainsHash);

    _rootManager.forTest_optimisticPropagate(_connectors, _fees, _encodedData);
  }
}

contract RootManager_SlowPropagate is Base {
  event RootPropagated(bytes32 aggregateRoot, uint256 count, bytes32 domainsHash);

  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfLastCountIsGreaterThanCount(bytes32 aggregateRoot, uint256 lastCountBeforeOpMode) public {
    // MERKLE.count will be zero for this example since the tree is new.
    vm.assume(aggregateRoot > 0 && lastCountBeforeOpMode > 0);
    _rootManager.forTest_setLastCountBeforeOpMode(lastCountBeforeOpMode);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_OldAggregateRoot.selector));
    _rootManager.forTest_slowPropagate(_connectors, _fees, _encodedData);
  }

  function test_revertIfLastCountIsEqualToCount(bytes32 aggregateRoot, uint256 lastCountBeforeOpMode) public {
    vm.assume(aggregateRoot > 0 && lastCountBeforeOpMode > 0);

    vm.mockCall(
      _merkle,
      abi.encodeWithSelector(MerkleTreeManager.rootAndCount.selector),
      abi.encode(aggregateRoot, lastCountBeforeOpMode)
    );

    _rootManager.forTest_setLastCountBeforeOpMode(lastCountBeforeOpMode);

    vm.expectRevert(abi.encodeWithSelector(RootManager.RootManager_OldAggregateRoot.selector));
    _rootManager.forTest_slowPropagate(_connectors, _fees, _encodedData);
  }

  function test_deleteFinalizedOptimisticAggregateRoot(bytes32 aggregateRoot, uint256 count) public {
    vm.assume(aggregateRoot > 0 && count > _rootManager.lastCountBeforeOpMode());
    utils_generateAndAddConnectors(_connectors.length, false, true);
    vm.mockCall(
      _merkle,
      abi.encodeWithSelector(MerkleTreeManager.rootAndCount.selector),
      abi.encode(aggregateRoot, count)
    );

    _rootManager.forTest_setFinalizedOptimisticRoot(aggregateRoot);

    _rootManager.forTest_slowPropagate(_connectors, _fees, _encodedData);

    bytes32 _finalizedOptimisticRoot = _rootManager.finalizedOptimisticAggregateRoot();

    assertEq(_finalizedOptimisticRoot, 0);
  }

  function test_emitEventRootPropagated(bytes32 aggregateRoot, uint256 count) public {
    vm.assume(aggregateRoot > 0 && count > _rootManager.lastCountBeforeOpMode());

    utils_generateAndAddConnectors(_connectors.length, false, true);

    bytes32 _domainsHash = _rootManager.domainsHash();

    vm.expectEmit(true, true, true, true);
    emit RootPropagated(aggregateRoot, count, _domainsHash);

    vm.mockCall(
      _merkle,
      abi.encodeWithSelector(MerkleTreeManager.rootAndCount.selector),
      abi.encode(aggregateRoot, count)
    );
    _rootManager.forTest_slowPropagate(_connectors, _fees, _encodedData);
  }
}

contract RootManager_SendRootToHubs is Base {
  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfRedundantRoot(bytes32 aggregateRoot) public {
    _rootManager.forTest_setLastPropagatedRoot(aggregateRoot);

    vm.expectRevert(bytes("redundant root"));
    _rootManager.forTest_sendRootToHubs(aggregateRoot, _connectors, _fees, _encodedData);
  }

  function test_sendRootToSpokes(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot > 0);
    utils_generateAndAddConnectors(_connectors.length, false, true);
    _rootManager.forTest_sendRootToHubs(aggregateRoot, _connectors, _fees, _encodedData);
  }

  function test_shouldNotRevertIfAmbMessageReverts(bytes32 aggregateRoot, uint32 reverterDomain) public {
    vm.assume(aggregateRoot > 0);

    // Ensure that the fuzzed revertereDomain is never equal to one of the valid domains.
    for (uint256 i = 0; i < _domains.length; i++) {
      vm.assume(_domains[i] != reverterDomain);
    }

    // Mock calls for the valid connectors
    for (uint256 i = 0; i < _connectors.length; i++) {
      vm.mockCall(_connectors[i], abi.encodeWithSelector(IHubConnector.sendMessage.selector), abi.encode());
    }

    // create reverter connector
    ReverterConnector reverterConnector = new ReverterConnector();

    // add the reverter domain + connector to arrays
    _domains.push(reverterDomain);
    _connectors.push(address(reverterConnector));
    _fees.push(0);
    _encodedData.push(bytes(""));

    // set domains with reverter domain included
    _rootManager.forTest_setDomains(_domains);

    vm.expectEmit(true, true, true, true);
    emit PropagateFailed(reverterDomain, address(reverterConnector));

    _rootManager.forTest_sendRootToHubs(aggregateRoot, _connectors, _fees, _encodedData);
  }

  function test_revertIfSendingIncorrectAmounOfEth(
    bytes32 aggregateRoot,
    uint32 newDomain,
    address newConnector
  ) public {
    vm.assume(aggregateRoot > 0);
    vm.assume(newConnector != address(0));

    // Ensure that the fuzzed revertereDomain is never equal to one of the valid domains.
    for (uint256 i = 0; i < _domains.length; i++) {
      vm.assume(_domains[i] != newDomain);
    }

    _domains.push(newDomain);
    _connectors.push(newConnector);
    _fees.push(10);
    _encodedData.push(bytes(""));

    utils_generateAndAddConnectors(_connectors.length, false, true);

    vm.expectRevert(stdError.arithmeticError);
    // sends 0 eth
    _rootManager.forTest_sendRootToHubs(aggregateRoot, _connectors, _fees, _encodedData);
  }
}

contract RootManager_FinalizeAndPropagate is Base {
  function setUp() public virtual override {
    super.setUp();
  }

  function test_revertIfContractPaused(
    address[] memory connectors,
    uint256[] memory fees,
    bytes[] memory encodedData
  ) public {
    _rootManager.forTest_pause();
    vm.expectRevert(bytes("Pausable: paused"));
    _rootManager.finalizeAndPropagate(connectors, fees, encodedData);
  }

  function test_finalizeAndPropagate(bytes32 aggregateRoot) public {
    vm.assume(aggregateRoot != 0);
    _rootManager.forTest_setOptimisticMode(true);
    utils_generateAndAddConnectors(_connectors.length, false, true);
    _rootManager.forTest_setProposeData(aggregateRoot, block.timestamp - 1);
    _rootManager.forTest_setFinalizedOptimisticRoot(aggregateRoot);

    _rootManager.finalizeAndPropagate(_connectors, _fees, _encodedData);
  }
}
