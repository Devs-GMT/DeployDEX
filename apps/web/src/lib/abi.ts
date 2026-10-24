// Must match contracts/DeployDex.sol
const projectComponents = [
  { name: "lister", type: "address" },
  { name: "target", type: "address" },
  { name: "name", type: "string" },
  { name: "tagline", type: "string" },
  { name: "category", type: "uint8" },
  { name: "liveUrl", type: "string" },
  { name: "repo", type: "string" },
  { name: "logoUrl", type: "string" },
  { name: "stars", type: "uint32" },
  { name: "hidden", type: "bool" },
  { name: "listedAt", type: "uint64" },
  { name: "updatedAt", type: "uint64" },
] as const;

const editInputs = [
  { name: "name", type: "string" },
  { name: "tagline", type: "string" },
  { name: "category", type: "uint8" },
  { name: "liveUrl", type: "string" },
  { name: "repo", type: "string" },
  { name: "logoUrl", type: "string" },
] as const;

export const deployDexAbi = [
  { type: "function", name: "curator", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "total", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function", name: "getProject", stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ type: "tuple", components: projectComponents }],
  },
  {
    type: "function", name: "getProjects", stateMutability: "view",
    inputs: [{ name: "from", type: "uint256" }, { name: "count", type: "uint256" }],
    outputs: [{ type: "tuple[]", components: projectComponents }],
  },
  { type: "function", name: "listedOf", stateMutability: "view", inputs: [{ name: "addr", type: "address" }], outputs: [{ type: "uint256[]" }] },
  { type: "function", name: "starredOf", stateMutability: "view", inputs: [{ name: "addr", type: "address" }], outputs: [{ type: "uint256[]" }] },
  {
    type: "function", name: "isStarred", stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }, { name: "addr", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function", name: "idOfTarget", stateMutability: "view",
    inputs: [{ name: "target", type: "address" }],
    outputs: [{ name: "found", type: "bool" }, { name: "id", type: "uint256" }],
  },
  {
    type: "function", name: "list", stateMutability: "nonpayable",
    inputs: [{ name: "target", type: "address" }, ...editInputs],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    type: "function", name: "update", stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }, ...editInputs],
    outputs: [],
  },
  { type: "function", name: "star", stateMutability: "nonpayable", inputs: [{ name: "id", type: "uint256" }], outputs: [] },
  { type: "function", name: "unstar", stateMutability: "nonpayable", inputs: [{ name: "id", type: "uint256" }], outputs: [] },
  {
    type: "function", name: "setHidden", stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }, { name: "hidden", type: "bool" }],
    outputs: [],
  },
  { type: "error", name: "NotAContract", inputs: [] },
  { type: "error", name: "AlreadyListed", inputs: [{ name: "id", type: "uint256" }] },
  { type: "error", name: "TooLong", inputs: [] },
  { type: "error", name: "EmptyName", inputs: [] },
  { type: "error", name: "NotLister", inputs: [] },
  { type: "error", name: "NotCurator", inputs: [] },
  { type: "error", name: "NoSuchProject", inputs: [] },
  { type: "error", name: "SelfStar", inputs: [] },
  { type: "error", name: "AlreadyStarred", inputs: [] },
  { type: "error", name: "NotStarred", inputs: [] },
] as const;
