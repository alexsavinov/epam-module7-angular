import {IUser} from "../../user/interfaces";
import {ICertificate} from "../../certificate/interfaces";

export interface IOrder {
    id?: number;
    price: number;
    user: IUser;
    certificate: ICertificate;
    createDate: string;
    lastUpdateDate: string;
}
