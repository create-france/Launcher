import { isRequestError } from '../../common/RequestError';
import XBLToken, {
  XBLTokenError,
  isXBLToken,
  isXBLTokenError,
} from './XBLToken';
import AuthToken, {
  AuthTokenError,
  isAuthToken,
  isAuthTokenError,
} from './AuthToken';
import XSTSToken, {
  XSTSTokenError,
  isXSTSToken,
  isXSTSTokenError,
} from './XSTSToken';
import MinecraftToken, {
  MinecraftTokenError,
  isMinecraftToken,
  isMinecraftTokenError,
} from './MicrosoftMinecraftToken';

// minecraft (microsoft) authentication client id
export const MICROSOFT_CLIENT_ID = '00000000402b5328';

type MicrosoftLoginResult =
  | {
      success: true;
      tokens: {
        token: string;
        refreshToken: string;
      };
    }
  | {
      success: false;
      message: string;
    };

type MicrosoftRequestResult<T, E> =
  | {
      isError: true;
      data: E;
    }
  | {
      isError: false;
      data: T;
    };

export async function authCode2AuthToken(
  code: string,
): Promise<MicrosoftRequestResult<AuthToken, AuthTokenError>> {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://login.live.com/oauth20_token.srf',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      client_id: MICROSOFT_CLIENT_ID,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
      scope: 'service::user.auth.xboxlive.com::MBI_SSL',
    },
  };

  const result = await window.electron.ipcRenderer.makeRequest(config);

  if (isRequestError(result) && isAuthTokenError(result.data)) {
    return {
      data: result.data,
      isError: true,
    };
  }

  if (isAuthToken(result)) {
    return {
      data: result,
      isError: false,
    };
  }

  console.log('authTokenResult', result);

  return {
    data: {
      error: 'invalid data',
      error_description: 'invalid data',
    },
    isError: true,
  };
}

async function authToken2XBLToken(
  authToken: string,
): Promise<MicrosoftRequestResult<XBLToken, XBLTokenError>> {
  const config = {
    method: 'POST',
    url: 'https://user.auth.xboxlive.com/user/authenticate',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket: authToken,
      },
      RelyingParty: 'http://auth.xboxlive.com',
      TokenType: 'JWT',
    },
  };

  const result = await window.electron.ipcRenderer.makeRequest(config);

  if (isRequestError(result) && isXBLTokenError(result.data)) {
    return {
      data: result.data,
      isError: true,
    };
  }

  if (isXBLToken(result)) {
    return {
      data: result,
      isError: false,
    };
  }

  console.log('Invalid data for XBLToken', result);

  return {
    data: {
      error: 'invalid data',
      detail: result,
    },
    isError: true,
  };
}

async function xblToken2XSTSToken(
  xblToken: string,
): Promise<MicrosoftRequestResult<XSTSToken, XSTSTokenError>> {
  const config = {
    method: 'POST',
    url: 'https://xsts.auth.xboxlive.com/xsts/authorize',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      Properties: {
        SandboxId: 'RETAIL',
        UserTokens: [xblToken],
      },
      RelyingParty: 'rp://api.minecraftservices.com/',
      TokenType: 'JWT',
    },
  };

  const result = await window.electron.ipcRenderer.makeRequest(config);

  if (isRequestError(result) && isXSTSTokenError(result.data)) {
    return {
      data: result.data,
      isError: true,
    };
  }

  if (isXSTSToken(result)) {
    return {
      data: result,
      isError: false,
    };
  }

  console.log('Invalid data for XSTSToken', result);

  return {
    data: {
      Identity: '-1',
      XErr: -1,
      Message: 'Invalid data',
      Redirect: '',
    },
    isError: true,
  };
}

async function xstsToken2MinecraftToken(
  xstsToken: string,
  xstsTokenUhs: string,
): Promise<MicrosoftRequestResult<MinecraftToken, MinecraftTokenError>> {
  const config = {
    method: 'POST',
    url: 'https://api.minecraftservices.com/authentication/login_with_xbox',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      identityToken: `XBL3.0 x=${xstsTokenUhs};${xstsToken}`,
      ensureLegacyEnabled: true,
    },
  };

  const result = await window.electron.ipcRenderer.makeRequest(config);

  if (isRequestError(result) && isMinecraftTokenError(result.data)) {
    return {
      data: result.data,
      isError: true,
    };
  }

  if (isMinecraftToken(result)) {
    return {
      data: result,
      isError: false,
    };
  }

  console.log('Invalid data for MinecraftToken', result);

  return {
    isError: true,
    data: {
      error: 'Invalid data',
      detail: {},
    },
  };
}

export async function authToken2MinecraftToken(
  authToken: string,
): Promise<MicrosoftRequestResult<MinecraftToken, string>> {
  // Authorization Token -> XBL Token
  const xblTokenResult = await authToken2XBLToken(authToken);

  if (xblTokenResult.isError) {
    return {
      isError: true,
      data: `Unable to get XBL token at microsoft authenticating: ${xblTokenResult.data.error}`,
    };
  }

  const xblToken = xblTokenResult.data.Token;

  // XBL Token -> XSTS Token
  const xstsTokenResult = await xblToken2XSTSToken(xblToken);

  if (xstsTokenResult.isError) {
    return {
      isError: true,
      data: `Unable to get XSTS token at microsoft authenticating: ${xstsTokenResult.data.Message}`,
    };
  }

  const xstsToken = xstsTokenResult.data.Token;
  const xstsTokenUhs = xstsTokenResult.data.DisplayClaims?.xui[0].uhs;

  // XSTS Token -> Minecraft Token
  const minecraftTokenResult = await xstsToken2MinecraftToken(
    xstsToken,
    xstsTokenUhs,
  );

  if (minecraftTokenResult.isError) {
    return {
      isError: true,
      data: `Unable to get minecraft token at microsoft authenticating: ${minecraftTokenResult.data.error}`,
    };
  }

  return {
    isError: false,
    data: minecraftTokenResult.data,
  };
}

export async function loginWithMicrosoftAccount(): Promise<MicrosoftLoginResult> {
  // Microsoft authentication
  let authCode = '';
  const result = await window.electron.ipcRenderer.invoke('ms-auth');
  const split = (result as string).split('&');

  split.forEach((part) => {
    const [key, value] = part.split('=');
    if (key === 'code') {
      authCode = value;
    }
  });

  if (authCode === '') {
    // unusable auth code
    return {
      success: false,
      message: 'Unable to get auth code at Microsoft authenticating',
    };
  }

  // Authorization Code -> Authorization Token
  const authTokenResult = await authCode2AuthToken(authCode);

  if (authTokenResult.isError) {
    return {
      success: false,
      message: `Unable to get auth token at Microsoft authenticating: ${authTokenResult.data.error_description}`,
    };
  }

  const authToken = authTokenResult.data.access_token;
  const refreshToken = authTokenResult.data.refresh_token;

  const minecraftTokenResult = await authToken2MinecraftToken(authToken);

  if (minecraftTokenResult.isError) {
    return {
      success: false,
      message: `Unable to get Minecraft token at Microsoft authenticating: ${minecraftTokenResult.data}`,
    };
  }

  const token = minecraftTokenResult.data.access_token;

  return {
    success: true,
    tokens: {
      token,
      refreshToken,
    },
  };
}
