import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {catchError, switchMap} from 'rxjs/operators'
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';

import {AuthService} from "../../modules/auth/services/auth.service";
import {IRefreshTokenResponse, IToken} from "../../modules/auth/interfaces";


@Injectable()
export class MainInterceptor implements HttpInterceptor {
  isRefreshing = false

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // console.log("MainInterceptor:", request);


    const isAuthenticated = this.authService.isAuthenticated();

    // console.log('***** intercept isAuthenticated', isAuthenticated)

    // console.log('!!  if (isAuthenticated)')
    if (isAuthenticated) {
      request = this.addToken(request, this.authService.getAccessToken())
      // console.log('***** intercept addToken', this.authService.getAccessToken())
    }

    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {

        // // FIXME 1
        // if (res && res.error && res.status === 405) {
        //   console.log("!!! FIXME 1")
        //   return throwError(() => new Error('ERROR TOKEN!'));
        // }
        //
        // // FIXME 2
        // if (res && res.error
        //   && res.status === 400
        //   && res.error == "Token invalid or expired") {
        //   console.log("!!! FIXME 2")
        //   console.log("res400: ", res);
        //
        //   return throwError(() => new Error(res.error.valueOf()));
        // }

        // // -- 401 errors
        // if (res && res.error && res.status === 401) {
        //   console.log("401 error: ", res)
        //   return this.handle401Error(request, next);
        // }

        // -- 403 errors
        if (res && res.error && res.status === 403) {

          console.log("403 error", res.error.error)
          return this.handleAccessError(request, next);
          // return throwError(() => new Error(`[${res.status}] ${res.error.error}`));
        }
        // -- 409 errors
        if (res && res.error && res.status === 409) {

          // console.log("409 error", res)
          // return this.handleAccessError(request, next);
          return throwError(() => new Error(`[${res.error.errorCode}] ${res.error.errorMessage}`));
        }

        // // -- 503 errors
        // if (res && res.error && res.status === 503) {
        //   // Error 11001 connecting to redis:6379. getaddrinfo failed.
        //   return throwError(() => new Error(res.error));
        // }


        this.router.navigate(['auth/login']);

        // this.authService.deleteToken();

        console.log(res)
        console.log(res.error)
        console.log(res.message)

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

      // Redirect to Login page if there is no Refresh token.
      if (this.authService.getRefreshToken() == null) {
        this.isRefreshing = false;
        this.router.navigate(['auth/login']);
        return;
      }

      return this.authService.refresh().pipe(
        switchMap((tokens: IRefreshTokenResponse) => {
          console.log('get !new! access token', tokens.accessToken)
          return next.handle(this.addToken(request, tokens.accessToken))
        }),
        catchError((error) => {
          console.log("handleAccessError -- " + error);
          this.isRefreshing = false;
          this.authService.clearToken();
          this.router.navigate(['auth/login']);
          return throwError(() => new Error(`${error}`));
        })
      )
    }
  }
}