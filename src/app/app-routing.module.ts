import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from "./modules/auth/guards";
import {HomepageComponent, MainLayoutComponent, PagenotfoundComponent} from "./shared";


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: HomepageComponent},
      {path: 'auth', loadChildren: () => import('./modules').then(value => value.AuthModule)},
      {path: 'users', loadChildren: () => import('./modules').then(value => value.UserModule)},
      {path: 'tags', loadChildren: () => import('./modules').then(value => value.TagModule)},
      {path: 'certificate', loadChildren: () => import('./modules').then(value => value.CertificateModule)},
      {path: 'order', loadChildren: () => import('./modules').then(value => value.OrderModule)},
    ]
  },
  {path: '**', pathMatch: 'full', component: PagenotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
