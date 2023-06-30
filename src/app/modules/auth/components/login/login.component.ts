import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {CustomErrorStateMatcher} from '../../../../shared';
import {AuthDataService, AuthService} from '../../services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  matcher = new CustomErrorStateMatcher();
  hide = true;
  infoMessage: string;
  errorMessage: string;
  isAuthenticated: boolean;
  isLoading = false;

  constructor(private authService: AuthService,
              private dataService: AuthDataService,
              private router: Router) {
  }

  _createForm(): void {
    this.form = new FormGroup({
      username: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          // Validators.pattern(
          //   /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{4,}/
          // ),
        ]),
    })
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this._createForm();
  }

  login() {
    this.errorMessage = '';
    this.infoMessage = '';

    const rawValue = this.form.getRawValue();
    if (!rawValue) {
      return;
    }

    this.authService.login(rawValue).subscribe({
      next: (value) => {
        this.isLoading = true;
        this.authService.saveToken(value);
        this.infoMessage = 'Login successful! Redirecting to homepage..';
        this.isAuthenticated = this.authService.isAuthenticated();
        this.dataService.isAuthenticated.next(this.authService.isAuthenticated());
        this.dataService.username.next(this.authService.getUsername());
        this.dataService.shoppingCardSize.next(0);
        setTimeout(() => this.router.navigate(['']), 2000);
      },
      error: e => {
        this.errorMessage = e.message + ' - Incorrect username or password!';
      }
    })
  }
}
