interface XSTSToken {
  IssueInstant: string;
  NotAfter: string;
  Token: string;
  DisplayClaims: {
    xui: {
      uhs: string;
    }[];
  };
}

export function isXSTSToken(data: any): data is XSTSToken {
  return (
    typeof data === 'object' &&
    typeof data.IssueInstant === 'string' &&
    typeof data.NotAfter === 'string' &&
    typeof data.Token === 'string' &&
    typeof data.DisplayClaims === 'object'
  );
}

export interface XSTSTokenError {
  Identity: string;
  XErr: number;
  Message: string;
  Redirect: string;
}

export function isXSTSTokenError(data: any): data is XSTSTokenError {
  return (
    typeof data === 'object' &&
    typeof data.Identity === 'string' &&
    typeof data.XErr === 'number' &&
    typeof data.Message === 'string' &&
    typeof data.Redirect === 'string'
  );
}

export default XSTSToken;
