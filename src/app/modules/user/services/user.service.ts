import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {urls} from '../../../../constants';
import {IPageable} from "../../../shared/interfaces";
import {IUser, IUserCreateRequest, IUserUpdateRequest} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable: IPageable): Observable<any> {
    return this.httpClient.get<any>(`${urls.users}?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort},${pageable.direction}`);
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
    // return <Observable>true;
  }
}
