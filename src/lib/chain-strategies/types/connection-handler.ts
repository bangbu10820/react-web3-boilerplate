import type { Alchemy as AlchemyClient } from "alchemy-sdk";
import type { Connection as SolanaConnection } from "@solana/web3.js";
import type { PublicClient } from "viem";

export interface ChainStrategyConnectionHandler {
  solanaConnection?: SolanaConnection;
  alchemyClient?: AlchemyClient;
  viemPublicClient?: PublicClient;
}
