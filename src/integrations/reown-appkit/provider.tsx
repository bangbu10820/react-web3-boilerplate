import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";

import {
  bitcoin,
  bitcoinTestnet,
  mainnet,
  sepolia,
  solana,
  solanaDevnet,
} from "@reown/appkit/networks";
import { ReownAuthentication } from "@reown/appkit-siwx";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider, http } from "wagmi";
import { BitcoinAdapter } from "@reown/appkit-adapter-bitcoin";
import type { AppKitNetwork } from "@reown/appkit/networks";
import type { ReactNode } from "react";

// 0. Check env
const REOWN_PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID;
if (!REOWN_PROJECT_ID) {
  throw new Error("VITE_REOWN_PROJECT_ID is not set");
}

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
if (!ALCHEMY_API_KEY) {
  throw new Error("VITE_ALCHEMY_API_KEY is not set");
}

// 1. Setup networks
const networks: [AppKitNetwork, ...Array<AppKitNetwork>] = [
  mainnet,
  sepolia,
  solana,
  solanaDevnet,
  bitcoin,
  bitcoinTestnet,
];

const customRpcUrls = {
  // mainnet
  ["eip155:1"]: [
    {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    },
  ],
  [solana.caipNetworkId]: [
    {
      url: `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    },
  ],
};

const wagmiTransports = {
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
};

// 2. Create adapters
const solanaWeb3JsAdapter = new SolanaAdapter();

const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId: REOWN_PROJECT_ID,
  networks,
  transports: wagmiTransports,
});

const bitcoinAdapter = new BitcoinAdapter({
  projectId: REOWN_PROJECT_ID,
});

// 3. Set up the metadata - Optional
const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 4. Create the AppKit instance
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter, bitcoinAdapter],
  networks,
  metadata,
  projectId: REOWN_PROJECT_ID,
  features: {
    analytics: true,
  },
  customRpcUrls,
  siwx: new ReownAuthentication(),
});

// 5. extract wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig;

export function WagmiAppkitProvider({ children }: { children: ReactNode }) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}
