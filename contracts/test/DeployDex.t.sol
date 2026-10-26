// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DeployDex} from "../DeployDex.sol";

contract Dummy {}

contract DeployDexTest is Test {
    DeployDex dex;
    address curator = address(this);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);
    address target;
    address target2;

    function setUp() public {
        dex = new DeployDex();
        target = address(new Dummy());
        target2 = address(new Dummy());
    }

    function _list(address who, address t) internal returns (uint256 id) {
        vm.prank(who);
        id = dex.list(t, "Demo", "A tagline", DeployDex.Category.Hackathon, "https://example.com", "owner/repo", "");
    }

    // ---- list
    function testListRealContract() public {
        uint256 id = _list(alice, target);
        assertEq(id, 0);
        assertEq(dex.total(), 1);
        DeployDex.Project memory p = dex.getProject(0);
        assertEq(p.lister, alice);
        assertEq(p.target, target);
        assertEq(p.stars, 0);
        assertFalse(p.hidden);
        (bool found, uint256 fid) = dex.idOfTarget(target);
        assertTrue(found);
        assertEq(fid, 0);
        assertEq(dex.listedOf(alice).length, 1);
    }

    function testListEoaReverts() public {
        vm.prank(alice);
        vm.expectRevert(DeployDex.NotAContract.selector);
        dex.list(bob, "Demo", "t", DeployDex.Category.AI, "https://x.io", "o/r", "");
    }

    function testDuplicateReverts() public {
        _list(alice, target);
        vm.prank(bob);
        vm.expectRevert(abi.encodeWithSelector(DeployDex.AlreadyListed.selector, 0));
        dex.list(target, "Other", "t", DeployDex.Category.AI, "https://x.io", "o/r", "");
    }

    function testCapsAndEmptyName() public {
        vm.startPrank(alice);
        vm.expectRevert(DeployDex.EmptyName.selector);
        dex.list(target, "", "t", DeployDex.Category.AI, "https://x.io", "o/r", "");
        // tagline 81 chars
        vm.expectRevert(DeployDex.TooLong.selector);
        dex.list(target, "n", string(new bytes(81)), DeployDex.Category.AI, "https://x.io", "o/r", "");
        vm.stopPrank();
    }

    // ---- update
    function testUpdateByListerOnly() public {
        _list(alice, target);
        vm.prank(bob);
        vm.expectRevert(DeployDex.NotLister.selector);
        dex.update(0, "N", "t", DeployDex.Category.AI, "https://x.io", "o/r", "");

        vm.prank(alice);
        dex.update(0, "New name", "new tag", DeployDex.Category.DevTools, "https://y.io", "o/r2", "https://y.io/l.png");
        DeployDex.Project memory p = dex.getProject(0);
        assertEq(p.name, "New name");
        assertEq(p.target, target); // contract address can never change
        assertEq(uint8(p.category), uint8(DeployDex.Category.DevTools));
    }

    function testUpdateUnknownIdReverts() public {
        vm.expectRevert(DeployDex.NoSuchProject.selector);
        dex.update(7, "N", "t", DeployDex.Category.AI, "https://x.io", "o/r", "");
    }

    // ---- stars
    function testStarUnstarFlow() public {
        _list(alice, target);
        vm.prank(bob);
        dex.star(0);
        assertEq(dex.getProject(0).stars, 1);
        assertTrue(dex.isStarred(0, bob));
        assertEq(dex.starredOf(bob).length, 1);

        vm.prank(bob);
        dex.unstar(0);
        assertEq(dex.getProject(0).stars, 0);
        assertFalse(dex.isStarred(0, bob));
        assertEq(dex.starredOf(bob).length, 0);
    }

    function testSelfStarAndDoubleStarRevert() public {
        _list(alice, target);
        vm.prank(alice);
        vm.expectRevert(DeployDex.SelfStar.selector);
        dex.star(0);

        vm.startPrank(bob);
        dex.star(0);
        vm.expectRevert(DeployDex.AlreadyStarred.selector);
        dex.star(0);
        vm.stopPrank();
    }

    function testUnstarWithoutStarReverts() public {
        _list(alice, target);
        vm.prank(bob);
        vm.expectRevert(DeployDex.NotStarred.selector);
        dex.unstar(0);
    }

    function testStarredOfSwapPopKeepsOthers() public {
        _list(alice, target);
        _list(alice, target2);
        vm.startPrank(bob);
        dex.star(0);
        dex.star(1);
        dex.unstar(0);
        vm.stopPrank();
        uint256[] memory ids = dex.starredOf(bob);
        assertEq(ids.length, 1);
        assertEq(ids[0], 1);
    }

    // ---- hide
    function testHideCuratorOnly() public {
        _list(alice, target);
        vm.prank(bob);
        vm.expectRevert(DeployDex.NotCurator.selector);
        dex.setHidden(0, true);

        dex.setHidden(0, true); // test contract is the curator
        assertTrue(dex.getProject(0).hidden);
        dex.setHidden(0, false);
        assertFalse(dex.getProject(0).hidden);
    }

    // ---- views
    function testGetProjectsPaginationAndBounds() public {
        _list(alice, target);
        _list(alice, target2);
        assertEq(dex.getProjects(0, 10).length, 2);
        assertEq(dex.getProjects(1, 10).length, 1);
        assertEq(dex.getProjects(5, 10).length, 0);
        assertEq(dex.getProjects(0, 1).length, 1);
    }

    // ---- delist
    function testDelistByListerHidesAndFreesTarget() public {
        _list(alice, target);
        vm.prank(alice);
        dex.delist(0);
        assertTrue(dex.delisted(0));
        assertTrue(dex.getProject(0).hidden);
        (bool found, ) = dex.idOfTarget(target);
        assertFalse(found);
        // The contract can be listed again, under a new id.
        uint256 id = _list(bob, target);
        assertEq(id, 1);
        (bool again, uint256 fid) = dex.idOfTarget(target);
        assertTrue(again);
        assertEq(fid, 1);
    }

    function testDelistListerOnlyAndOnce() public {
        _list(alice, target);
        vm.prank(bob);
        vm.expectRevert(DeployDex.NotLister.selector);
        dex.delist(0);
        vm.expectRevert(DeployDex.NotLister.selector);
        dex.delist(0); // curator is not the lister either
        vm.startPrank(alice);
        dex.delist(0);
        vm.expectRevert(DeployDex.IsDelisted.selector);
        dex.delist(0);
        vm.stopPrank();
    }

    function testDelistedBlocksStarUpdateAndUnhide() public {
        _list(alice, target);
        vm.prank(bob);
        dex.star(0);
        vm.prank(alice);
        dex.delist(0);

        address carol = address(0xCA201);
        vm.prank(carol);
        vm.expectRevert(DeployDex.IsDelisted.selector);
        dex.star(0);

        vm.prank(alice);
        vm.expectRevert(DeployDex.IsDelisted.selector);
        dex.update(0, "New", "t", DeployDex.Category.AI, "https://x.io", "o/r", "");

        vm.expectRevert(DeployDex.IsDelisted.selector);
        dex.setHidden(0, false);

        // Existing stars can still be taken back.
        vm.prank(bob);
        dex.unstar(0);
        assertEq(dex.getProject(0).stars, 0);
    }

    function testGetProjectUnknownReverts() public {
        vm.expectRevert(DeployDex.NoSuchProject.selector);
        dex.getProject(0);
    }
}
