import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TagComponent, TagsComponent} from "./components";
import {tagResolver} from "./services/resolvers";
import {formGuard} from "../../shared";


const routes: Routes = [
  {path: '', component: TagsComponent},
  {path: 'add', component: TagComponent, canDeactivate: [formGuard]},
  {path: ':id', component: TagComponent, resolve: {data: tagResolver}, canDeactivate: [formGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule {
}
