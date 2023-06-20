import {NgModule} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {
  MaterialModule,
  MainInterceptor,
  MainLayoutComponent,
  HeaderComponent,
  FooterComponent,
  HomepageComponent,
  PagenotfoundComponent,
  ModalConfirmComponent
} from "./shared";
import { ModalConfirmDeleteComponent } from './shared/components/modal-confirm-delete/modal-confirm-delete.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    PagenotfoundComponent,
    ModalConfirmComponent,
    ModalConfirmDeleteComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: MainInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
