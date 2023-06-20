import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

import {urls} from '../../../../constants';
import {
  ILoginRequest,
  ILoginResponse,
  IMessageResponse,
  IRefreshTokenResponse, IRegisterRequest
} from '../interfaces';
import {IUser} from "../../user/interfaces";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _accessTokenKey = 'access';
  private _refreshTokenKey = 'refresh';

  constructor(private httpClient: HttpClient) {
  }

  register(user: IRegisterRequest): Observable<IMessageResponse> {
    return this.httpClient.post<IMessageResponse>(`${urls.auth}/register`, user);
  }

  login(loginRequest: ILoginRequest): Observable<ILoginResponse> {
    return this.httpClient.post<ILoginResponse>(`${urls.auth}/login`, loginRequest);
  }

  refresh(): Observable<IRefreshTokenResponse> {
    const IRefreshTokenRequest = {refreshToken: this.getRefreshToken()};
    return this.httpClient.post<IRefreshTokenResponse>(`${urls.auth}/refreshtoken`, IRefreshTokenRequest).pipe(
      tap((response: IRefreshTokenResponse) => {
        localStorage.setItem(this._accessTokenKey, response.accessToken);
        localStorage.setItem(this._refreshTokenKey, response.refreshToken);
      })
    )
  }

  saveToken(token: ILoginResponse): void {
    localStorage.setItem(this._accessTokenKey, token.token);
    localStorage.setItem(this._refreshTokenKey, token.refreshToken);
  }

  logout(): Observable<IMessageResponse> {
    return this.httpClient.post<IMessageResponse>(`${urls.auth}/logout`, null);
  }

  clearToken(): void {
    localStorage.removeItem(this._accessTokenKey);
    localStorage.removeItem(this._refreshTokenKey);
  }

  getAccessToken(): string {
    return localStorage.getItem(this._accessTokenKey) as string;
  }

  getRefreshToken(): string {
    return localStorage.getItem(this._refreshTokenKey) as string;
  }

  isAuthenticated(): boolean {
    return (!!localStorage.getItem(this._accessTokenKey));
  }

  private parseAccessToken() {
    let accessToken = this.getAccessToken();
    let payload = accessToken.split(".")[1];
    payload = window.atob(payload);
    return JSON.parse(payload)
  }

  getUserId(): string {
    let payload = this.parseAccessToken();
    const idFromToken = payload.jti;

    return idFromToken;
  }

  getUsername(): string {
    let payload = this.parseAccessToken();
    const nameFromToken = payload.sub;

    return nameFromToken;
  }
}
