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

export interface ISignInWithPasswordRequestData {
  password: string;
}

export interface ISendMediaToMe {
  filename: string;
  filepath: string;
  message?: string;
}

export interface IDownloadFile {}
