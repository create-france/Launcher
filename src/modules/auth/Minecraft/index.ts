import { isRequestError } from '../../common/RequestError';
import { isMinecraftAccountEntitlements } from './MinecraftAccountEntitlements';
import MinecraftProfile, { isMinecraftProfile } from './MinecraftProfile';

export async function checkIfMinecraftOwner(
  minecraftToken: string,
): Promise<boolean> {
  const config = {
    method: 'GET',
    url: 'https://api.minecraftservices.com/entitlements/mcstore',
    headers: {
      Authorization: `Bearer ${minecraftToken}`,
    },
  };

  const result = await window.electron.ipcRenderer.makeRequest(config);

  if (isRequestError(result)) {
    return false;
  }

  if (!isMinecraftAccountEntitlements(result) || result.items.length === 0) {
    return false;
  }

  return true;
}

export async function getMinecraftProfile(minecraftToken: string): Promise<
  | {
      success: true;
      profile: MinecraftProfile;
    }
  | {
      success: false;
      error: string;
      detail?: any;
    }
> {
  const config = {
    method: 'GET',
    url: 'https://api.minecraftservices.com/minecraft/profile',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${minecraftToken}`,
    },
  };

  const result = await window.electron.ipcRenderer.makeRequest(config);

  if (isRequestError(result)) {
    return {
      success: false,
      error: 'Error while fetching Minecraft profile',
      detail: result.data,
    };
  }

  if (isMinecraftProfile(result)) {
    return {
      success: true,
      profile: result,
    };
  }

  return {
    success: false,
    error: 'Invalid data received',
    detail: result,
  };
}
