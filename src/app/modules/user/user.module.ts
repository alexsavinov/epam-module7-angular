import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserComponent, UsersComponent} from "./components";
import {MaterialModule} from "../../shared";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    UsersComponent,
    UserComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class UserModule {
}
