import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';

import {CertificateRoutingModule} from './certificate-routing.module';
import {MaterialModule} from '../../shared';
import {CertificateComponent, CertificatesComponent, CertificatesSelectComponent, SearchComponent} from './components';


@NgModule({
  declarations: [
    CertificatesComponent,
    CertificateComponent,
    CertificatesSelectComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    CertificateRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgOptimizedImage
  ]
})
export class CertificateModule {
}
