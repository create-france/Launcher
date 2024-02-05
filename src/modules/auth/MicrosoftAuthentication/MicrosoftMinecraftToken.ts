interface MinecraftToken {
  username: string;
  roles: [];
  access_token: string;
  token_type: string;
  expires_in: number;
}

export function isMinecraftToken(data: any): data is MinecraftToken {
  return (
    typeof data === 'object' &&
    typeof data.username === 'string' &&
    Array.isArray(data.roles) &&
    typeof data.access_token === 'string' &&
    typeof data.token_type === 'string' &&
    typeof data.expires_in === 'number'
  );
}

export interface MinecraftTokenError {
  error: string;
  detail?: any;
}

export function isMinecraftTokenError(data: any): data is MinecraftTokenError {
  return typeof data === 'object' && typeof data.error === 'string';
}

export default MinecraftToken;
