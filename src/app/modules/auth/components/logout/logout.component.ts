import {Component, OnInit} from '@angular/core';
import {AuthService, AuthDataService} from "../../services";
import {Router} from "@angular/router";
import {emptyLoginResponse} from "../../interfaces";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  // isAuthenticated: boolean;
  infoMessage: string;
  errorMessage: string;

  constructor(private dataService: AuthDataService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    // this.isAuthenticated = this.authService.isAuthenticated();
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

    this.authService.logout().subscribe({
      next: (value): void => {
        // console.log(value)
        // this.dataService.profile.next(emptyLoginResponse());
        this.infoMessage = `${value.message} Redirecting to login page..`;
        // this.isAuthenticated = false;
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
