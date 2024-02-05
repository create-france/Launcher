import { BrowserWindow, ipcMain } from 'electron';
import { authCode2AuthToken } from '../../modules/auth/MicrosoftAuthentication';

ipcMain.handle(
  'ms-auth',
  () =>
    new Promise((resolve) => {
      const win = new BrowserWindow({
        width: 1000,
        height: 800,
        autoHideMenuBar: true,
        title: 'Log in to Microsoft...',
      });

      win.loadURL(
        'https://login.live.com/oauth20_authorize.srf' +
          '?client_id=00000000402b5328' +
          '&response_type=code' +
          '&prompt=login' +
          '&scope=service%3A%3Auser.auth.xboxlive.com%3A%3AMBI_SSL' +
          '&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf',
      );

      win.webContents.on('will-redirect', (_ev, url) => {
        const pref = 'https://login.live.com/oauth20_desktop.srf?';
        if (url.startsWith(`${pref}code=`)) {
          win.close();
          resolve(url.substring(pref.length));
        }
      });

      win.on('closed', () => resolve('null'));
    }),
);

ipcMain.handle('ms-authCode2AuthToken', (_, args) => {
  const authCode = args[0] as string;

  return authCode2AuthToken(authCode);
});
