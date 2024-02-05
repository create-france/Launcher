interface MinecraftAccountEntitlements {
  items: {
    names: string;
    signature: string;
  }[];
  signature: string;
  keyId: string;
}

export function isMinecraftAccountEntitlements(
  data: any,
): data is MinecraftAccountEntitlements {
  return (
    typeof data === 'object' &&
    Array.isArray(data.items) &&
    typeof data.signature === 'string' &&
    typeof data.keyId === 'string'
  );
}

export default MinecraftAccountEntitlements;
