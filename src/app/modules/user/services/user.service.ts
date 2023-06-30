import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {urls} from '../../../../constants';
import {IUser, IUserCreateRequest, IUserUpdateRequest} from '../interfaces';
import {IPageable} from '../../../shared/interfaces';
import {SearchStringHelper} from '../../../shared';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  stringHelper = new SearchStringHelper();

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable?: IPageable): Observable<any> {
    const pageableString = this.stringHelper.pageableToString(pageable);
    const searchString = this.stringHelper.suffix('?', pageableString) + pageableString;
    return this.httpClient.get<any>(`${urls.users}${searchString}`);
  }

  getById(id: string): Observable<IUser> {
    return this.httpClient.get<IUser>(`${urls.users}/${id}`);
  }

  create(user: IUserCreateRequest): Observable<IUser> {
    return this.httpClient.post<IUser>(`${urls.users}`, user);
  }

  update(user: IUserUpdateRequest): Observable<IUser> {
    return this.httpClient.patch<IUser>(`${urls.users}`, user);
  }

  deleteById(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${urls.users}/${id}`);
  }
}
