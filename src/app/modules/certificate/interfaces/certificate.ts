import {ITag} from "../../tag/interfaces";

export interface ICertificate {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  tags: ITag[];
}
