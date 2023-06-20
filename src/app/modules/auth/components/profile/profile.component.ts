import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common'

import {IUser} from "../../../user/interfaces";
import {IRole} from "../../interfaces";
import {AuthService} from "../../services";
import {UserService} from "../../../user/services";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  roles: string;

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.accessToken = this.authService.getAccessToken();
    this.refreshToken = this.authService.getRefreshToken();

    this.activatedRoute.data.subscribe(({data}) => {
      this.user = data as IUser;
      this.roles = data.roles.map((role: IRole) => role.name).join(', ');
    });
  }

  back() {
    this.location.back()
  }
}
