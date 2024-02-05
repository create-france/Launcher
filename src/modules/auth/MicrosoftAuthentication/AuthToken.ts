interface AuthToken {
  token_type: 'bearer';
  expires_in: number;
  scope: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  foci: string;
}

export function isAuthToken(data: any): data is AuthToken {
  return (
    typeof data === 'object' &&
    typeof data.token_type === 'string' &&
    typeof data.expires_in === 'number' &&
    typeof data.scope === 'string' &&
    typeof data.access_token === 'string' &&
    typeof data.refresh_token === 'string' &&
    typeof data.user_id === 'string' &&
    typeof data.foci === 'string'
  );
}

export interface AuthTokenError {
  error: string;
  error_description: string;
  correlation_id?: string;
}

export function isAuthTokenError(data: any): data is AuthTokenError {
  return (
    typeof data === 'object' &&
    typeof data.error === 'string' &&
    typeof data.error_description === 'string'
  );
}

export default AuthToken;
