export function formatAddressDisplay(
  address: string,
  options: { prefixLength?: number; suffixLength?: number } = {}
): string {
  const { prefixLength = 6, suffixLength = 4 } = options;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}
