interface XBLToken {
  IssueInstant: string;
  NotAfter: string;
  Token: string;
  DisplayClaims: {
    xui: {
      uhs: string;
    }[];
  };
}

export function isXBLToken(data: any): data is XBLToken {
  return (
    typeof data === 'object' &&
    typeof data.IssueInstant === 'string' &&
    typeof data.NotAfter === 'string' &&
    typeof data.Token === 'string' &&
    typeof data.DisplayClaims === 'object'
  );
}

export interface XBLTokenError {
  error: string;
  detail?: any;
}

export function isXBLTokenError(data: any): data is XBLTokenError {
  return typeof data === 'object' && typeof data.error === 'string';
}

export default XBLToken;
