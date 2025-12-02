import { Alchemy } from "alchemy-sdk";
import { erc20Abi, formatEther, formatUnits } from "viem";
import { EvmChainMaps } from "../constants/network-rpcs";
import { createViemPublicClient } from "../utils/viem";
import { isEVMAddress } from "../utils";
import type { Address } from "viem";
import type { TokenMetadataResponse } from "alchemy-sdk";
import type {
  ChainStrategy,
  ChainStrategyConnectionHandler,
  SupportedChainType,
} from "../types";

export class Eip155ChainStrategy implements ChainStrategy {
  chainType: SupportedChainType;
  connectionHandlers: Map<string, ChainStrategyConnectionHandler>;

  tokenMetadatasMap: Map<string, TokenMetadataResponse>;

  constructor() {
    this.chainType = "eip155";
    this.connectionHandlers = new Map();

    this.tokenMetadatasMap = new Map();
  }

  getConnectionHandler(chainId: string): ChainStrategyConnectionHandler {
    let connectionHandler = this.connectionHandlers.get(chainId);
    if (!connectionHandler) {
      const network = EvmChainMaps[chainId];
      if (!network) {
        throw new Error(`Network for chain ${chainId} not found`);
      }
      const alchemyClient = new Alchemy({
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
        network,
      });

      const viemPublicClient = createViemPublicClient(Number(chainId));
      connectionHandler = {
        alchemyClient,
        viemPublicClient,
      };
      this.connectionHandlers.set(chainId, connectionHandler);
      return this.connectionHandlers.get(chainId)!;
    }
    return connectionHandler;
  }

  async getNativeTokenBalance(params: {
    address: string;
    connectionHandler: ChainStrategyConnectionHandler;
  }) {
    const { connectionHandler, address } = params;

    const publicClient = connectionHandler.viemPublicClient;
    if (!publicClient) {
      throw new Error("No viem public client found");
    }
    const balance = await publicClient.getBalance({
      address: address as Address,
    });

    return {
      balance: {
        rawAmount: balance.toString(),
        formattedAmount: formatEther(balance),
      },
    };
  }

  async getTokenBalances(params: {
    address: string;
    connectionHandler: ChainStrategyConnectionHandler;
  }) {
    const { connectionHandler, address } = params;

    const alchemyClient = connectionHandler.alchemyClient;
    if (!alchemyClient) {
      throw new Error("No alchemy client found");
    }

    const tokenBalancesResponse =
      await alchemyClient.core.getTokenBalances(address);

    const nonZeroBalances = tokenBalancesResponse.tokenBalances.filter(
      (token) =>
        token.tokenBalance &&
        token.tokenBalance !==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
    );

    const tokenBalances = nonZeroBalances.map((token) => {
      return {
        tokenAddress: token.contractAddress,
        rawAmount: BigInt(token.tokenBalance || "0").toString(),
      };
    });

    // const tokenBalances: Array<ChainTokenBalance> = await Promise.all(
    //   nonZeroBalances.map(async (token) => {
    //     let meta = this.tokenMetadatasMap.get(token.contractAddress);
    //     if (!meta) {
    //       meta = await alchemyClient.core.getTokenMetadata(
    //         token.contractAddress
    //       );
    //       this.tokenMetadatasMap.set(token.contractAddress, meta);
    //     }
    //     const decimals = meta.decimals || 0;
    //     return {
    //       tokenAddress: token.contractAddress,
    //       rawAmount: BigInt(token.tokenBalance || "0").toString(),
    //       formattedAmount: formatUnits(
    //         BigInt(token.tokenBalance || "0"),
    //         decimals
    //       ),
    //     };
    //   })
    // );

    return { balances: tokenBalances };
  }

  async getTokenBalanceWithTokenAddress(params: {
    connectionHandler: ChainStrategyConnectionHandler;
    tokenAddress: string;
    ownerAddress: string;
  }) {
    const { connectionHandler, tokenAddress, ownerAddress } = params;

    const publicClient = connectionHandler.viemPublicClient;
    if (!publicClient) {
      throw new Error("No viem public client found");
    }

    const calls = [
      // Get balance of the token
      {
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [ownerAddress as Address],
      },
      // Get decimals of the token
      {
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ];

    const results = await publicClient.multicall({
      contracts: calls,
    });
    const isError = results.some((result) => result.status === "failure");
    if (isError) {
      const errors = results.map((result) => result.error).filter(Boolean);
      throw errors.length > 0
        ? errors[0]
        : new Error("Failed to get token balance");
    }

    const balance = results[0].result as bigint;
    const decimals = results[1].result as bigint;
    return {
      balance: {
        rawAmount: balance.toString(),
        formattedAmount: formatUnits(balance, Number(decimals)),
        tokenAddress: tokenAddress,
      },
    };
  }

  verifyWalletAddress(params: { address: string }) {
    const { address } = params;
    return isEVMAddress(address);
  }
}
