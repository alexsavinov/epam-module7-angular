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
  AuthInterceptor,
  MainLayoutComponent,
  HeaderComponent,
  FooterComponent,
  HomepageComponent,
  PagenotfoundComponent,
  ModalConfirmComponent,
  ModalConfirmDeleteComponent,
  ShoppingCartComponent
} from "./shared";
import { AccessDeniedPageComponent } from './shared/components/access-denied-page/access-denied-page.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    PagenotfoundComponent,
    ModalConfirmComponent,
    ModalConfirmDeleteComponent,
    ShoppingCartComponent,
    AccessDeniedPageComponent
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
      useClass: AuthInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
