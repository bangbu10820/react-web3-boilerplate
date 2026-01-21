import { createPublicClient, extractChain, http } from "viem";
import * as chains from "viem/chains";
import { STRATEGY_RPC_MAP } from "../constants/network-rpcs";

function getChain(id: number) {
  return extractChain({
    chains: Object.values(chains),
    // @ts-expect-error
    id,
  }) as chains.Chain;
}

export function createViemPublicClient(id: number) {
  const chain = getChain(id);
  return createPublicClient({
    chain,
    transport: http(STRATEGY_RPC_MAP[id.toString()]),
  });
}
