import { PublicKey } from "@solana/web3.js";
import { isAddress } from "viem";

export function isSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (_error) {
    return false;
  }
}

export function isEVMAddress(address: string, strict = false): boolean {
  try {
    return isAddress(address, {
      strict,
    });
  } catch (_error) {
    return false;
  }
}
