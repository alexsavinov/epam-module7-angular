import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

import {AuthService, AuthDataService} from "../services";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {

  isAuthenticated: boolean;

  constructor(private authService: AuthService, private dataService: AuthDataService) {
    // console.log('AuthGuard [constructor] isAuthenticated', this.isAuthenticated)
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.dataService.isAuthenticated.next(this.isAuthenticated);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log('AuthGuard [canActivate] state', state.url)
    // console.log('AuthGuard [canActivate] isAuthenticated', this.isAuthenticated)

    let allow: boolean = true;

    switch (state.url) {
      case '/auth/login':
        // allow = !this.isAuthenticated;
        break;
      case '/auth/register':
        // allow = !this.isAuthenticated;
        break;
      case '/auth/logout':
        // allow = this.isAuthenticated;
        break;
      case '/auth/profile':
      // console.log('111')
      // allow = this.isAuthenticated;
      // break;
      default: {
        allow = true;
      }
    }

    return allow;
  }

}
