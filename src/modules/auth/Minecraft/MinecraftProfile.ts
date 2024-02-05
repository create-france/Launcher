interface MinecraftProfile {
  id: string;
  name: string;
  skins: {
    id: string;
    state: string;
    url: string;
  }[];
  capes: {
    id: string;
    state: string;
    url: string;
  }[];
}

export function isMinecraftProfile(data: any): data is MinecraftProfile {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    Array.isArray(data.skins) &&
    Array.isArray(data.capes)
  );
}

export default MinecraftProfile;
