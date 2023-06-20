export interface ITag {
  id?: number;
  name: string;
}

export function emptyTag(): ITag {
  return {
    name: ''
  }
}
