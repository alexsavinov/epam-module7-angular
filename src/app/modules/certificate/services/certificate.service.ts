import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {urls} from '../../../../constants';
import {ICertificate, ISearchRequest} from '../interfaces';
import {IPageable} from '../../../shared/interfaces';
import {SearchStringHelper} from '../../../shared';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  stringHelper = new SearchStringHelper();

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable: IPageable): Observable<any> {
    const pageableString = this.stringHelper.pageableToString(pageable);
    const searchString = this.stringHelper.suffix('?', pageableString) + pageableString;
    return this.httpClient.get<any>(`${urls.certificates}${searchString}`);
  }

  search(pageable: IPageable, searchRequest: ISearchRequest): Observable<any> {
    const searchString = this.stringHelper.searchString(pageable, searchRequest);
    return this.httpClient.get<any>(`${urls.certificates}/search${searchString}`);
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
