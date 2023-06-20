import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {formGuard} from "../../shared";
import {userResolver} from "../user/services/resolvers";
import {AuthGuard} from "./guards";
import {LoginComponent, LogoutComponent, ProfileComponent, RegisterComponent} from "./components";


const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard], canDeactivate: [formGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], resolve: {data: userResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
