import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {OrdersComponent, UserOrdersComponent} from './components';


const routes: Routes = [
  {path: '', component: OrdersComponent},
  {path: 'user', component: UserOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {
}
