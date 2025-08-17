import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

import {
  arbitrum,
  mainnet,
  sepolia,
  solana,
  solanaDevnet,
  solanaTestnet,
} from "@reown/appkit/networks";

import { ReownAuthentication } from "@reown/appkit-siwx";

// 0. Create the Ethers adapter
export const ethersAdapter = new EthersAdapter();

// 1. Create Solana adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

// 2. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
if (!projectId) {
  throw new Error("VITE_REOWN_PROJECT_ID is not set");
}

// 3. Set up the metadata - Optional
const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 4. Create the AppKit instance
export const modal = createAppKit({
  adapters: [ethersAdapter, solanaWeb3JsAdapter],
  networks: [mainnet, arbitrum, sepolia, solana, solanaTestnet, solanaDevnet],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
  siwx: new ReownAuthentication(),
});

export const setupAppKit = () => {
  //
};
