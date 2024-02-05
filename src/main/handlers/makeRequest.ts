import axios, { AxiosRequestConfig } from 'axios';
import { ipcMain } from 'electron';
import RequestError, {
  isRequestError,
} from '../../modules/common/RequestError';

ipcMain.handle('makeRequest', async (_, args) => {
  const config = args[0] as AxiosRequestConfig;

  const result = await axios
    .request(config as AxiosRequestConfig)
    .catch((e): RequestError => {
      if (e.response) {
        return {
          data: e.response.data,
          status: e.response.status,
          statusText: e.response.statusText,
        };
      }

      if (e.request) {
        return {
          data: {
            error: 'No response received',
          },
          status: -1,
          statusText: 'No response received',
        };
      }

      return {
        data: {
          error: e.message,
        },
        status: -1,
        statusText: 'Unknown error',
      };
    });

  return isRequestError(result) ? result : result.data;
});
