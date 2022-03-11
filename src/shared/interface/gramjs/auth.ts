export interface ISendCodeRequestData {
  phoneNumber: string;
}

export interface ISendCodeResponseData {
  phoneCodeHash: string;
}

export interface ISignInRequestData {
  phoneNumber: string;
  phoneCodeHash: string;
  phoneCode: string;
}

export interface ISignInResponseData {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
}

export interface IPasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPowRequestData {
  salt1: Uint8Array;
  salt2: Uint8Array;
  g: number;
  p: Uint8Array;
}

export interface ISignInWithPasswordRequestData {
  password: string;
}
