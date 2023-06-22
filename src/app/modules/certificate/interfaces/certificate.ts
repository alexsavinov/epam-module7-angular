import {ITag} from "../../tag/interfaces";

export interface ICertificate {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  tags: ITag[];
}

export interface ISearchRequest {
  name?: string;
  tags?: string;
}

export function emptyCertificate(): ICertificate {
  return {
    name: '',
    description: '',
    price: 0,
    duration: 0,
    tags: []
  }
}
