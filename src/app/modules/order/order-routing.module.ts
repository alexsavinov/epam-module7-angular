import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {OrdersComponent} from "./components";


const routes: Routes = [
  {path: '', component: OrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {
}
