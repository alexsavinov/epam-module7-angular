import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../shared';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent, LogoutComponent, ProfileComponent, RegisterComponent} from './components';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class AuthModule {
}
