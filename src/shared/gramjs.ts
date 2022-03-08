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
