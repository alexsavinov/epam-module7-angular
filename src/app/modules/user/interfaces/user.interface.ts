import {IRole} from "../../auth/interfaces";

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

export interface IServerResponseUsers {
  total_items: number;
  total_pages: number;
  page_number: number;
  prev: string;
  next: string;
  data: IUser[];
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
