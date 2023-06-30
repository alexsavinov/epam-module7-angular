import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {catchError, switchMap} from 'rxjs/operators'
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';

import {IRefreshTokenResponse} from '../../modules/auth/interfaces';
import {AuthService} from "../../modules/auth/services";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshing = false

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      request = this.addToken(request, this.authService.getAccessToken())
    }

    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {

        // -- 403 errors
        if (res && res.error && res.status === 403) {
          return this.handleAccessError(request, next);
        }

        // -- 409 errors
        if (res && res.error && res.status === 409) {
          return throwError(() => new Error(`[${res.error.errorCode}] ${res.error.errorMessage}`));
        }

        this.router.navigate(['auth/login']);

        return throwError(() => new Error(res.message));
      })
    ) as any;
  }

  addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    })
  }

  handleAccessError(request: HttpRequest<any>, next: HttpHandler): any {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.getRefreshToken() == null) {
        this.isRefreshing = false;
        this.router.navigate(['auth/login']);
        return;
      }

      return this.authService.refresh().pipe(
        switchMap((tokens: IRefreshTokenResponse) => {
          return next.handle(this.addToken(request, tokens.accessToken))
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.clearToken();
          this.router.navigate(['auth/login']);
          return throwError(() => new Error(`${error}`));
        })
      )
    }
  }
}
