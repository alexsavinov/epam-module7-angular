import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {OrderRoutingModule} from './order-routing.module';
import {MaterialModule} from '../../shared';
import {InvoiceComponent, OrderComponent, OrdersComponent, UserOrdersComponent} from './components';


@NgModule({
  declarations: [
    OrderComponent,
    OrdersComponent,
    UserOrdersComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OrderModule {
}
