import { useQuery } from "@tanstack/react-query";
import { STRATEGY_QUERY_KEYS } from "../constants/query-keys";
import type { SupportedChainType } from "../types";
import { chainRegistry } from "@/lib/chain-strategies";

export const useStrategyAllTokenBalances = ({
  chainId,
  chainType,
  enabled: rawEnabled = true,
  walletAddress,
}: {
  chainId?: string;
  chainType?: SupportedChainType;
  enabled?: boolean;
  walletAddress?: string;
}) => {
  const enabled = rawEnabled && !!walletAddress && !!chainId && !!chainType;

  return useQuery({
    queryKey: STRATEGY_QUERY_KEYS.ALL_TOKEN_BALANCES_WALLET(
      chainId || "",
      chainType || "eip155",
      walletAddress || ""
    ),
    queryFn: async () => {
      const strategy = chainRegistry.getStrategy(chainType!);
      const connectionHandler = strategy.getConnectionHandler(chainId!);

      const [nativeBalance, tokenBalances] = await Promise.all([
        strategy.getNativeTokenBalance({
          address: walletAddress!,
          connectionHandler,
        }),
        strategy.getTokenBalances({
          address: walletAddress!,
          connectionHandler,
        }),
      ]);

      return {
        nativeBalance: nativeBalance.balance,
        tokenBalances: tokenBalances.balances,
        balances: [nativeBalance.balance, ...tokenBalances.balances],
      };
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 1,
    meta: {
      persist: true,
    },
  });
};
