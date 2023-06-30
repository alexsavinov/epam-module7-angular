import {IRole} from '../../auth/interfaces';

export interface IUser {
  id?: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  roles?: IRole[];
}

export interface IUserUpdateRequest {
  id: number;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
}

export interface IUserCreateRequest {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  roles: string[];
}

export function emptyUser(): IUser {
  return {
    email: '',
    name: '',
    username: '',
    password: '',
    roles: []
  }
}
