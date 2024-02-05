import { loginWithMicrosoftAccount } from './MicrosoftAuthentication';
import { checkIfMinecraftOwner, getMinecraftProfile } from './Minecraft';

export interface Account {
  username: string;
  uuid: string;
  accessToken: string;
  refreshToken: string;
  mode: 'microsoft';
}

type ConnectionResult =
  | {
      success: true;
      account: Account;
    }
  | {
      success: false;
      message: string;
    };

export async function login(): Promise<ConnectionResult> {
  const microsoftLoginResult = await loginWithMicrosoftAccount();

  if (!microsoftLoginResult.success) {
    return microsoftLoginResult;
  }

  const { token: minecraftToken, refreshToken } = microsoftLoginResult.tokens;

  const isMinecraftOwner = await checkIfMinecraftOwner(minecraftToken);

  if (!isMinecraftOwner) {
    return {
      success: false,
      message: 'You do not own Minecraft',
    };
  }

  const profileMinecraft = await getMinecraftProfile(minecraftToken);

  if (!profileMinecraft.success) {
    return {
      success: false,
      message: profileMinecraft.error,
    };
  }

  return {
    success: true,
    account: {
      username: profileMinecraft.profile.name,
      uuid: profileMinecraft.profile.id,
      accessToken: minecraftToken,
      refreshToken,
      mode: 'microsoft',
    },
  };
}
