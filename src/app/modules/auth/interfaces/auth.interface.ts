export interface IToken {
  id: number;
  refresh: string;
  access: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  id: number;
  email: string;
  username: string;
  roles: IRole[];
  token: string;
  refreshToken: string;
}

export interface IRegisterRequest {
  id?: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: EnumRole[];
}

export function emptyLoginResponse(): ILoginResponse {
  return {
    id: 0,
    email: '',
    username: '',
    roles: [],
    token: '',
    refreshToken: ''
  }
}

export interface IMessageResponse {
  message: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRole {
  id: number;
  name: EnumRole;
}

export enum EnumRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}
