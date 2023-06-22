import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CertificatesComponent, SearchComponent} from "./components";


const routes: Routes = [
  {path: '', component: CertificatesComponent},
  {path: 'search', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificateRoutingModule {
}
