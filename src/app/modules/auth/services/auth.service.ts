import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

import {urls} from '../../../../constants';
import {
  EnumRole,
  ILoginRequest, ILoginResponse,
  IMessageResponse, IRefreshTokenResponse, IRegisterRequest
} from '../interfaces';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _accessTokenKey = 'access';
  private _refreshTokenKey = 'refresh';
  private _shoppingCard = 'shopping-card';

  constructor(private httpClient: HttpClient,
              private router: Router) {
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
    this.setShoppingCard();
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

  getRoles(): EnumRole[] {
    let payload = this.parseAccessToken();
    const roles = payload.roles;

    return roles;
  }

  addToShoppingCard(id: number): number {
    const shoppingCard = this.getShoppingCard();
    if (!shoppingCard.includes(id)) {
      shoppingCard.push(id);
      this.setShoppingCard(shoppingCard);
    }
    return shoppingCard.length;
  }

  removeFromShoppingCard(id: number | undefined): number {
    if (!id) {
      return 0;
    }
    let shoppingCard = this.getShoppingCard();
    const index = shoppingCard.indexOf(id);
    if (index > -1) {
      shoppingCard = shoppingCard.filter(item => item !== id)
      this.setShoppingCard(shoppingCard);
    }
    return shoppingCard.length;
  }

  getShoppingCard(): number[] {
    const shoppingCardStorage = localStorage.getItem(this._shoppingCard);
    if (shoppingCardStorage) {
      return JSON.parse(shoppingCardStorage);
    } else {
      localStorage.setItem(this._shoppingCard, JSON.stringify([]));
    }
    return [];
  }

  setShoppingCard(shoppingCard?: number[]): void {
    if (shoppingCard) {
      localStorage.setItem(this._shoppingCard, JSON.stringify(shoppingCard));
    } else {
      localStorage.removeItem(this._shoppingCard);
    }
  }

  hasRole(role: EnumRole): boolean {
    if (this.isAuthenticated()) {
      return this.getRoles().includes(role);
    }
    return false;
  }

  checkAccess(requiredRole?: EnumRole): boolean {
    console.log('checkAccess [isAuthenticated]', this.isAuthenticated())
    if (!this.isAuthenticated()) {
      this.router.navigate(['access-denied']);
      return true;
    }

    console.log('checkAccess [requiredRole]', requiredRole)
    if (requiredRole && !this.hasRole(requiredRole)) {

      this.router.navigate(['access-denied']);
      return true;
    }

    return false;
  }
}
