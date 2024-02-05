interface RequestError {
  status: number;
  data?: object;
  statusText: string;
}

export function isRequestError(data: any): data is RequestError {
  return (
    typeof data === 'object' &&
    typeof data.status === 'number' &&
    (data.status < 200 || data.status > 299) &&
    typeof data.statusText === 'string'
  );
}

export default RequestError;
