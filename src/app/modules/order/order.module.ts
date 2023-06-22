import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {OrderRoutingModule} from './order-routing.module';
import {MaterialModule} from "../../shared";
import {OrderComponent, OrdersComponent} from "./components";


@NgModule({
  declarations: [
    OrderComponent,
    OrdersComponent
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
