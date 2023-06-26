import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {urls} from "../../../../constants";
import {ITag} from "../interfaces";
import {IPageable} from "../../../shared/interfaces";
import {SearchStringHelper} from "../../../shared";


@Injectable({
  providedIn: 'root'
})
export class TagService {

  stringHelper = new SearchStringHelper();

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable?: IPageable): Observable<any> {
    const pageableString = this.stringHelper.pageableToString(pageable);
    const searchString = this.stringHelper.suffix('?', pageableString) + pageableString;
    return this.httpClient.get<any>(`${urls.tags}${searchString}`);
  }

  getById(id: string): Observable<ITag> {
    return this.httpClient.get<ITag>(`${urls.tags}/${id}`);
  }

  getTopUsedTag(userId: string): Observable<ITag> {
    return this.httpClient.get<ITag>(`${urls.tags}/top-used-tag?userId=${userId}`);
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
