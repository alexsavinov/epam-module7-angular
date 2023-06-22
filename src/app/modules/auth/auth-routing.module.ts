import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {formGuard} from "../../shared";
import {LoginComponent, LogoutComponent, ProfileComponent, RegisterComponent} from "./components";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'register', component: RegisterComponent, canDeactivate: [formGuard]},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
