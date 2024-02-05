// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { AxiosRequestConfig } from 'axios';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ms-auth' | 'ms-authCode2AuthToken';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, args);
    },
    makeRequest(config: AxiosRequestConfig) {
      return ipcRenderer.invoke('makeRequest', [config]);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
