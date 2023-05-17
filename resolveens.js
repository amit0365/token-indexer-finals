// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "GaCNPW5S3u8VOtmXr2lQFK19L6S1LeSv",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

alchemy.core.resolveName("vitalik.eth").then(console.log);