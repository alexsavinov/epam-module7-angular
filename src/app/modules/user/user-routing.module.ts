import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserComponent, UsersComponent} from "./components";
import {userResolver} from "./services/resolvers";
import {formGuard} from "../../shared";


const routes: Routes = [
  // {path: '', component: UsersComponent, resolve: {data: usersResolver}, data: { pageable: undefined }},
  {path: '', component: UsersComponent},
  {path: 'add', component: UserComponent, canDeactivate: [formGuard]},
  {path: ':id', component: UserComponent, resolve: {data: userResolver}, canDeactivate: [formGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
