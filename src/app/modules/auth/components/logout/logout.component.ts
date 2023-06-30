import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService, AuthDataService} from '../../services';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  infoMessage: string;
  errorMessage: string;

  constructor(private dataService: AuthDataService,
              private authService: AuthService,
              private router: Router) {
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.infoMessage = '';
  }

  redirectToLoginPageWithTimeout(): void {
    setTimeout(() => this.router.navigate(['auth/login']), 2000);
  }

  logout(): void {
    this.clearMessages();
    this.dataService.shoppingCardSize.next(0);

    this.authService.logout().subscribe({
      next: (value): void => {
        this.infoMessage = `${value.message} Redirecting to login page..`;
        this.dataService.isAuthenticated.next(false);
        this.authService.clearToken();
        this.redirectToLoginPageWithTimeout();
      },
      error: e => {
        this.errorMessage = `${e.message}. Access token expired! Force logout..`;
        this.redirectToLoginPageWithTimeout();
        this.authService.clearToken();
      }
    })
  }
}
