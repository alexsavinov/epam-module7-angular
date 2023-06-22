import {IUser} from "../../user/interfaces";
import {ICertificate} from "../../certificate/interfaces";

export interface IOrder {
    id?: number;
    certificate?: ICertificate;
    user?: IUser;
    price: number;
    createDate?: string;
    lastUpdateDate?: string;
}

export interface ICreateOrderRequest {
    userId: number;
    certificateId: number;
    price?: number;
}

export function emptyOrder(): IOrder {
  return {
    certificate: undefined,
    user: undefined,
    price: 0
  }
}
