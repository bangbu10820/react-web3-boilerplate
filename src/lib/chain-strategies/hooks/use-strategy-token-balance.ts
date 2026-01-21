import { useQuery } from "@tanstack/react-query";
import { STRATEGY_QUERY_KEYS } from "../constants/query-keys";
import { chainRegistry } from "../index";
import type { SupportedChainType } from "../types";

export const useStrategyTokenBalance = ({
  chainId,
  chainType,
  enabled: rawEnabled = true,
  walletAddress,
  tokenAddress,
}: {
  chainId?: string;
  chainType?: SupportedChainType;
  enabled?: boolean;
  walletAddress?: string;
  tokenAddress?: string;
}) => {
  const enabled = rawEnabled && !!walletAddress && !!chainId && !!chainType;

  return useQuery({
    queryKey: STRATEGY_QUERY_KEYS.TOKEN_BALANCE_WALLET(
      chainId || "",
      chainType || "eip155",
      walletAddress || "",
      tokenAddress || ""
    ),
    queryFn: async () => {
      const strategy = chainRegistry.getStrategy(chainType!);
      const connectionHandler = strategy.getConnectionHandler(chainId!);

      let balance;
      if (!tokenAddress) {
        balance = await strategy.getNativeTokenBalance({
          address: walletAddress!,
          connectionHandler,
        });
      } else {
        balance = await strategy.getTokenBalanceWithTokenAddress({
          connectionHandler,
          tokenAddress: tokenAddress,
          ownerAddress: walletAddress!,
        });
      }
      return {
        balance: balance.balance,
      };
    },
    enabled: enabled,
    staleTime: 1000 * 30,
    meta: {
      persist: true,
    },
  });
};
