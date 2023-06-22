import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {urls} from "../../../../constants";
import {IPageable} from "../../../shared/interfaces";
import {ICertificate, ISearchRequest} from "../interfaces";


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable: IPageable): Observable<any> {
    return this.httpClient.get<any>(`${urls.certificates}?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort},${pageable.direction}`);
  }

  search(pageable: IPageable, searchRequest: ISearchRequest): Observable<any> {
    let searchString: string = '';
    if (searchRequest.name) {
      searchString += `&name=${searchRequest.name}`;
    }
    if (searchRequest.tags) {
      searchString += `&tags=${searchRequest.tags}`;
    }
    console.log(searchString)
    return this.httpClient.get<any>(`${urls.certificates}/search/?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort},${pageable.direction}${searchString}`);
  }

  getById(id: string): Observable<ICertificate> {
    return this.httpClient.get<ICertificate>(`${urls.certificates}/${id}`);
  }

  create(certificate: ICertificate): Observable<ICertificate> {
    return this.httpClient.post<ICertificate>(`${urls.certificates}`, certificate);
  }

  update(certificate: ICertificate): Observable<ICertificate> {
    return this.httpClient.patch<ICertificate>(`${urls.certificates}`, certificate);
  }

  deleteById(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${urls.certificates}/${id}`);
  }
}
