import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {emptyUser, IUser} from "../../../user/interfaces";
import {CustomErrorStateMatcher} from "../../../../shared";
import {EnumRole, IRegisterRequest} from "../../interfaces";
import {AuthService} from "../../services";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: IUser;
  form: FormGroup;
  matcher = new CustomErrorStateMatcher();
  hide = true;
  hideConfirm = true;
  infoMessage: string;
  errorMessage: string;

  constructor(private location: Location,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = emptyUser();
    this._createForm();
  }

  _createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        'a user #3',
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      username: new FormControl(
        'user3',
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      email: new FormControl(
        'null@mail.com',
        [
          Validators.required,
          Validators.email
        ]),
      password: new FormControl(
        'user3',
        [
          Validators.required,
          // Validators.pattern(
          //   /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          // ),
        ]),
      passwordConfirm: new FormControl(
        'user3',
        [
          Validators.required,
          // Validators.pattern(
          //   /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          // ),
        ]),
    })
  }

  back() {
    this.location.back()
  }

  onSubmit(form: FormGroup) {
    this.errorMessage = '';
    this.infoMessage = '';

    const newUser: IRegisterRequest = {
      name: form.value.name,
      email: form.value.email,
      username: form.value.username,
      password: form.value.password,
      role: [EnumRole.ROLE_USER]
    }

    this.authService.register(newUser).subscribe({
        next: (value) => {
          this.infoMessage = `${value.message}. Redirecting to login page..`;
          setTimeout(() => {
            this.form.reset();
            this.router.navigate(['auth/login']);
          }, 2000);
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }
}


