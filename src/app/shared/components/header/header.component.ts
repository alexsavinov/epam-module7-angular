import {Component, OnInit} from '@angular/core';

import {AuthService, AuthDataService} from "../../../modules/auth/services";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;
  username: string;

  constructor(private authService: AuthService,
              private dataService: AuthDataService) {
  }

  ngOnInit(): void {
    this.dataService.isAuthenticated.subscribe(value => this.isAuthenticated = value);
    this.dataService.username.subscribe(value => this.username = value);
    if (!this.isAuthenticated) {
      this.isAuthenticated = this.authService.isAuthenticated();
    }
    if (this.isAuthenticated && !this.username) {
      this.username = this.authService.getUsername();
    }
  }
}
