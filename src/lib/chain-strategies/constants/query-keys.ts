import type { SupportedChainType } from "../types";

export const STRATEGY_QUERY_KEYS = {
  BALANCE: () => ["strategy-balance"],

  ALL_TOKEN_BALANCES: () => [
    ...STRATEGY_QUERY_KEYS.BALANCE(),
    "strategy-all-token-balances",
  ],
  ALL_TOKEN_BALANCES_WALLET: (
    chainId: string,
    chainType: SupportedChainType,
    walletAddress: string
  ) => [
    ...STRATEGY_QUERY_KEYS.ALL_TOKEN_BALANCES(),
    chainId,
    chainType,
    walletAddress,
  ],

  TOKEN_BALANCE: () => [
    ...STRATEGY_QUERY_KEYS.BALANCE(),
    "strategy-token-balance",
  ],
  TOKEN_BALANCE_WALLET: (
    chainId: string,
    chainType: SupportedChainType,
    walletAddress: string,
    tokenAddress: string
  ) => [
    ...STRATEGY_QUERY_KEYS.TOKEN_BALANCE(),
    chainId,
    chainType,
    walletAddress,
    tokenAddress,
  ],
};
