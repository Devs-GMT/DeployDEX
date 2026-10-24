// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title DeployDex
/// @notice On-chain directory of BOT Chain dApps. Every listing points to a real contract.
/// No tokens, no payments. Deploy on the same chain as the dApps being listed
/// (`target.code.length` is checked against the chain the registry lives on).
contract DeployDex {
    enum Category { AI, RWA, Community, Productivity, FunLifestyle, DevTools, Hackathon, Other }

    struct Project {
        address lister;
        address target;
        string name;
        string tagline;
        Category category;
        string liveUrl;
        string repo;
        string logoUrl;
        uint32 stars;
        bool hidden;
        uint64 listedAt;
        uint64 updatedAt;
    }

    uint256 public constant MAX_NAME = 48;
    uint256 public constant MAX_TAGLINE = 80;
    uint256 public constant MAX_URL = 200;
    uint256 public constant MAX_REPO = 100;
    uint256 public constant MAX_PAGE = 100;

    Project[] public projects;
    /// @dev id + 1, so 0 means "not listed".
    mapping(address => uint256) private _idPlusOne;
    mapping(uint256 => mapping(address => bool)) public starred;
    mapping(address => uint256[]) private _listedBy;
    mapping(address => uint256[]) private _starredBy;
    address public curator;

    event Listed(uint256 indexed id, address indexed lister, address indexed target, Category category);
    event Updated(uint256 indexed id);
    event Starred(uint256 indexed id, address indexed by, uint32 stars);
    event Unstarred(uint256 indexed id, address indexed by, uint32 stars);
    event Hidden(uint256 indexed id, bool hidden);

    error NotAContract();
    error AlreadyListed(uint256 id);
    error TooLong();
    error EmptyName();
    error NotLister();
    error NotCurator();
    error NoSuchProject();
    error SelfStar();
    error AlreadyStarred();
    error NotStarred();

    constructor() {
        curator = msg.sender;
    }

    modifier exists(uint256 id) {
        if (id >= projects.length) revert NoSuchProject();
        _;
    }

    function list(
        address target,
        string memory name,
        string memory tagline,
        Category category,
        string memory liveUrl,
        string memory repo,
        string memory logoUrl
    ) external returns (uint256 id) {
        if (target.code.length == 0) revert NotAContract();
        uint256 existing = _idPlusOne[target];
        if (existing != 0) revert AlreadyListed(existing - 1);
        _validate(name, tagline, liveUrl, repo, logoUrl);

        id = projects.length;
        // Fill fields through a storage pointer (avoids "stack too deep" from a big struct literal).
        Project storage p = projects.push();
        p.lister = msg.sender;
        p.target = target;
        p.name = name;
        p.tagline = tagline;
        p.category = category;
        p.liveUrl = liveUrl;
        p.repo = repo;
        p.logoUrl = logoUrl;
        p.listedAt = uint64(block.timestamp);
        p.updatedAt = uint64(block.timestamp);
        _idPlusOne[target] = id + 1;
        _listedBy[msg.sender].push(id);
        emit Listed(id, msg.sender, target, category);
    }

    /// @notice Lister can edit everything except the contract address.
    function update(
        uint256 id,
        string memory name,
        string memory tagline,
        Category category,
        string memory liveUrl,
        string memory repo,
        string memory logoUrl
    ) external exists(id) {
        Project storage p = projects[id];
        if (p.lister != msg.sender) revert NotLister();
        _validate(name, tagline, liveUrl, repo, logoUrl);
        p.name = name;
        p.tagline = tagline;
        p.category = category;
        p.liveUrl = liveUrl;
        p.repo = repo;
        p.logoUrl = logoUrl;
        p.updatedAt = uint64(block.timestamp);
        emit Updated(id);
    }

    function star(uint256 id) external exists(id) {
        Project storage p = projects[id];
        if (p.lister == msg.sender) revert SelfStar();
        if (starred[id][msg.sender]) revert AlreadyStarred();
        starred[id][msg.sender] = true;
        _starredBy[msg.sender].push(id);
        p.stars += 1;
        emit Starred(id, msg.sender, p.stars);
    }

    function unstar(uint256 id) external exists(id) {
        if (!starred[id][msg.sender]) revert NotStarred();
        starred[id][msg.sender] = false;
        uint256[] storage mine = _starredBy[msg.sender];
        for (uint256 i = 0; i < mine.length; i++) {
            if (mine[i] == id) {
                mine[i] = mine[mine.length - 1];
                mine.pop();
                break;
            }
        }
        Project storage p = projects[id];
        p.stars -= 1;
        emit Unstarred(id, msg.sender, p.stars);
    }

    function setHidden(uint256 id, bool hidden) external exists(id) {
        if (msg.sender != curator) revert NotCurator();
        projects[id].hidden = hidden;
        emit Hidden(id, hidden);
    }

    // ---------------------------------------------------------------- views

    function getProject(uint256 id) external view exists(id) returns (Project memory) {
        return projects[id];
    }

    /// @notice Paginated read, oldest first. Includes hidden projects (frontend filters them).
    function getProjects(uint256 from, uint256 count) external view returns (Project[] memory out) {
        uint256 n = projects.length;
        if (from >= n) return new Project[](0);
        if (count > MAX_PAGE) count = MAX_PAGE;
        uint256 end = from + count;
        if (end > n) end = n;
        out = new Project[](end - from);
        for (uint256 i = from; i < end; i++) {
            out[i - from] = projects[i];
        }
    }

    function listedOf(address addr) external view returns (uint256[] memory) {
        return _listedBy[addr];
    }

    function starredOf(address addr) external view returns (uint256[] memory) {
        return _starredBy[addr];
    }

    function isStarred(uint256 id, address addr) external view returns (bool) {
        return starred[id][addr];
    }

    /// @notice Returns (found, id) for a contract address.
    function idOfTarget(address target) external view returns (bool found, uint256 id) {
        uint256 v = _idPlusOne[target];
        if (v == 0) return (false, 0);
        return (true, v - 1);
    }

    function total() external view returns (uint256) {
        return projects.length;
    }

    // ------------------------------------------------------------- internal

    function _validate(
        string memory name,
        string memory tagline,
        string memory liveUrl,
        string memory repo,
        string memory logoUrl
    ) private pure {
        if (bytes(name).length == 0) revert EmptyName();
        if (
            bytes(name).length > MAX_NAME ||
            bytes(tagline).length > MAX_TAGLINE ||
            bytes(liveUrl).length > MAX_URL ||
            bytes(repo).length > MAX_REPO ||
            bytes(logoUrl).length > MAX_URL
        ) revert TooLong();
    }
}
