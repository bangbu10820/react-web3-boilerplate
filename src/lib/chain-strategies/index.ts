import { Eip155ChainStrategy } from "./strategies/eip155";
import { SolanaChainStrategy } from "./strategies/solana";
import type { ChainStrategy, SupportedChainType } from "./types";

const eip155Strategy = new Eip155ChainStrategy();
const solanaStrategy = new SolanaChainStrategy();

// Partial record
const strategies: Partial<Record<SupportedChainType, ChainStrategy>> = {
  ["eip155"]: eip155Strategy,
  ["solana"]: solanaStrategy,
  // bip122 will be added later
};

export const chainRegistry = {
  getStrategy: (chainType: SupportedChainType) => {
    const strategy = strategies[chainType];
    if (!strategy) {
      throw new Error(`Strategy for chain type ${chainType} not found`);
    }

    return strategy;
  },

  isSupported: (chainType: SupportedChainType): boolean => {
    return chainType in strategies;
  },

  getSupportedChainTypes: (): Array<SupportedChainType> => {
    return Object.keys(strategies) as Array<SupportedChainType>;
  },

  getConnectionHandler: (chainType: SupportedChainType, chainId: string) => {
    if (!chainRegistry.isSupported(chainType)) {
      throw new Error(`Chain type ${chainType} not supported`);
    }
    const strategy = chainRegistry.getStrategy(chainType);
    return strategy.getConnectionHandler(chainId);
  },
};
