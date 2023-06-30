import {Component, Inject, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

import {emptyUser, IUser, IUserCreateRequest, IUserUpdateRequest} from '../../interfaces';
import {IRole} from '../../../auth/interfaces';
import {UserService} from '../../services';
import {CustomErrorStateMatcher, ModalConfirmComponent} from '../../../../shared';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: IUser;
  roles: string | undefined;

  form: FormGroup;
  matcher = new CustomErrorStateMatcher();

  hide: boolean = true;
  creating: boolean;

  infoMessage: string;
  errorMessage: string;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private router: Router,
              private matDialog: MatDialog,
              public dialogRef: MatDialogRef<UserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { id: number, creating: boolean }) {
  }


  ngOnInit() {
    if (this.data) {
      if (this.data['creating']) {
        this.creating = true;
        this.user = emptyUser();
        this._createForm();
      } else {
        const id: string = this.data['id'].toString();
        this.userService.getById(id).subscribe(data => {
          this.user = data as IUser;
          this.roles = data.roles?.map((role: IRole) => role.name).join(', ');
          this._createForm();
        });
      }
    }
  }

  _createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        this.user.name,
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      username: new FormControl(
        this.user.username,
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      email: new FormControl(
        this.user.email,
        [
          Validators.email
        ]),
      roles: new FormControl(
        this.roles),
      password: new FormControl(
        '',
        [
          (this.creating == true ? Validators.required : Validators.nullValidator)
        ])
    })
  }

  back(event: MouseEvent) {
    event.preventDefault();

    if (this.form.dirty) {
      const dialogRef = this.matDialog.open(ModalConfirmComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(false);
        }
      });
    } else {
      this.dialogRef.close(false)
    }
  }

  onSubmit(form: FormGroup) {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.creating) {
      this.createUser(form);
    } else {
      this.updateUser(form);
    }
  }

  private createUser(form: FormGroup<any>) {
    const user: IUserCreateRequest = {
      name: form.value.name,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      roles: ['user']
    }

    this.userService.create(user).subscribe({
        next: (value) => {
          this.infoMessage = `User '${value.name}' created..`;
          this.user = value;
          setTimeout(() => {
            this.form.reset();
            this.dialogRef.close(value.name);
          }, 2000);
        },
        error: e => {
          console.log(e)
          this.errorMessage = e.message;
        }
      }
    )
  }

  private updateUser(form: FormGroup<any>) {
    const user: IUserUpdateRequest = {
      id: this.user.id as number,
      name: form.value.name,
      username: form.value.username,
      email: form.value.email,
    }

    if (form.value.password) {
      user.password = form.value.password;
    }

    this.userService.update(user).subscribe({
        next: (value) => {
          this.infoMessage = `User (id=${value.id}) updated..`;
          this.user = value;
          setTimeout(() => {
            this.form.reset();
            this.dialogRef.close(value.name);
          }, 2000);
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }
}
