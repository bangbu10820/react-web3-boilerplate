import { Network } from "alchemy-sdk";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
if (!ALCHEMY_API_KEY) {
  throw new Error("Missing Alchemy API key");
}

export const STRATEGY_RPC_MAP: Partial<Record<string, string>> = {
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp":
    "https://solana-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY, // solana mainnet
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1:
    "https://solana-devnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY, // solana devnet
  "1": "https://eth-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY, // ethereum mainnet
};

export const EvmChainMaps: Partial<Record<string, Network>> = {
  ["1"]: Network.ETH_MAINNET,
};
