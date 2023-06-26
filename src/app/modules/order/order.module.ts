import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {OrderRoutingModule} from './order-routing.module';
import {MaterialModule} from "../../shared";
import {OrderComponent, OrdersComponent} from "./components";
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { InvoiceComponent } from './components/invoice/invoice.component';


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
