import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {UserRoutingModule} from './user-routing.module';
import {UserComponent, UsersComponent} from "./components";
import {MaterialModule} from "../../shared";
import { UsersSelectComponent } from './components/users-select/users-select.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserComponent,
    UsersSelectComponent
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
