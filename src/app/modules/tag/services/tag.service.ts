import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {urls} from "../../../../constants";
import {IPageable} from "../../../shared/interfaces";
import {ITag} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable?: IPageable): Observable<any> {
    if (pageable) {
      return this.httpClient.get<any>(`${urls.tags}?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort},${pageable.direction}`);
    } else {
      return this.httpClient.get<any>(`${urls.tags}`);
    }
  }

  getById(id: string): Observable<ITag> {
    return this.httpClient.get<ITag>(`${urls.tags}/${id}`);
  }

  create(tag: ITag): Observable<ITag> {
    return this.httpClient.post<ITag>(`${urls.tags}`, tag);
  }

  update(tag: ITag): Observable<ITag> {
    return this.httpClient.patch<ITag>(`${urls.tags}`, tag);
  }

  deleteById(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${urls.tags}/${id}`);
  }
}
