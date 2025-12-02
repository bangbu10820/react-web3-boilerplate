import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { STRATEGY_RPC_MAP } from "../constants/network-rpcs";
import { isSolanaAddress } from "../utils";
import type { SolanaJSONRPCError } from "@solana/web3.js";
import type {
  ChainStrategy,
  ChainStrategyConnectionHandler,
  ChainTokenBalance,
  SupportedChainType,
} from "../types";

export class SolanaChainStrategy implements ChainStrategy {
  chainType: SupportedChainType;
  connectionHandlers: Map<string, ChainStrategyConnectionHandler>;

  constructor() {
    this.chainType = "solana";
    this.connectionHandlers = new Map();
  }

  getConnectionHandler(chainId: string): ChainStrategyConnectionHandler {
    let connectionHandler = this.connectionHandlers.get(chainId);
    if (!connectionHandler) {
      const rpcUrl = STRATEGY_RPC_MAP[chainId];
      if (!rpcUrl) {
        throw new Error(`Rpc url for chain ${chainId} not found`);
      }
      connectionHandler = {
        solanaConnection: new Connection(rpcUrl, "confirmed"),
      };
      this.connectionHandlers.set(chainId, connectionHandler);
    }
    return connectionHandler;
  }

  async getNativeTokenBalance(params: {
    address: string;
    connectionHandler: ChainStrategyConnectionHandler;
  }) {
    const { connectionHandler, address } = params;

    const connection = connectionHandler.solanaConnection;
    if (!connection) {
      throw new Error("No connection found");
    }
    const balance = await connection.getBalance(new PublicKey(address));

    return {
      balance: {
        rawAmount: balance.toString(),
        formattedAmount: (balance / LAMPORTS_PER_SOL).toString(),
      },
    };
  }

  async getTokenBalances(params: {
    address: string;
    connectionHandler: ChainStrategyConnectionHandler;
  }) {
    const { connectionHandler, address } = params;

    const connection = connectionHandler.solanaConnection;
    if (!connection) {
      throw new Error("No connection found");
    }

    const pk = new PublicKey(address);

    const [tokenProgramBalances, token2022ProgramBalances] = await Promise.all([
      connection.getParsedTokenAccountsByOwner(pk, {
        programId: TOKEN_PROGRAM_ID,
      }),
      connection.getParsedTokenAccountsByOwner(pk, {
        programId: TOKEN_2022_PROGRAM_ID,
      }),
    ]);
    const rawAccounts = [
      ...tokenProgramBalances.value,
      ...token2022ProgramBalances.value,
    ];

    const tokenBalances: Array<ChainTokenBalance> = rawAccounts
      .map((accountInfo) => {
        return {
          tokenAddress: accountInfo.account.data["parsed"]["info"]["mint"],
          rawAmount:
            accountInfo.account.data.parsed.info.tokenAmount.amount || "0",
          formattedAmount:
            accountInfo.account.data["parsed"]["info"]["tokenAmount"][
              "uiAmountString"
            ] || "0",
        };
      })
      .filter((balance) => BigInt(balance.rawAmount) > BigInt(0));

    return {
      balances: tokenBalances,
    };
  }

  async getTokenBalanceWithTokenAddress({
    connectionHandler,
    tokenAddress,
    ownerAddress,
  }: {
    connectionHandler: ChainStrategyConnectionHandler;
    tokenAddress: string;
    ownerAddress: string;
  }) {
    const connection = connectionHandler.solanaConnection;
    if (!connection) {
      throw new Error("No connection found");
    }
    try {
      const mintAccount = new PublicKey(tokenAddress);
      const ownerAccount = new PublicKey(ownerAddress);

      const tokenAccount = getAssociatedTokenAddressSync(
        mintAccount,
        ownerAccount
      );

      const result = await connection.getTokenAccountBalance(tokenAccount);
      const balance = result.value;

      return {
        balance: {
          rawAmount: balance.amount.toString() || "0",
          formattedAmount: balance.uiAmountString || "0",
          tokenAddress: tokenAddress,
        },
      };
    } catch (error) {
      const rpcError = error as SolanaJSONRPCError;
      // If not found associated token account, return 0 balance
      if (rpcError.code === -32602) {
        return {
          balance: {
            rawAmount: "0",
            formattedAmount: "0",
            tokenAddress: tokenAddress,
          },
        };
      } else {
        throw error;
      }
    }
  }

  verifyWalletAddress(params: { address: string }) {
    const { address } = params;
    return isSolanaAddress(address);
  }
}
