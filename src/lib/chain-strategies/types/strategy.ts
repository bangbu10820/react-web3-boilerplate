import type { SupportedChainType } from "./supported-chain-type";
import type { ChainStrategyConnectionHandler } from "./connection-handler";

export interface ChainStrategy {
  chainType: SupportedChainType;
  connectionHandlers: Map<string, ChainStrategyConnectionHandler>;

  getConnectionHandler: (chainId: string) => ChainStrategyConnectionHandler;
  getNativeTokenBalance: (params: {
    address: string;
    connectionHandler: ChainStrategyConnectionHandler;
  }) => Promise<{ balance: ChainTokenBalance }>;

  getTokenBalances: (params: {
    address: string;
    connectionHandler: ChainStrategyConnectionHandler;
  }) => Promise<{ balances: Array<ChainTokenBalance> }>;

  verifyWalletAddress: (params: { address: string }) => boolean;

  getTokenBalanceWithTokenAddress: (params: {
    connectionHandler: ChainStrategyConnectionHandler;
    tokenAddress: string;
    ownerAddress: string;
  }) => Promise<{ balance: ChainTokenBalance }>;
}

export interface ChainTokenBalance {
  tokenAddress?: string; // for solana, this is the mint address. Native token has no tokenAddress.
  rawAmount: string;
  formattedAmount?: string;
}
