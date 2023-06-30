import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomepageComponent, MainLayoutComponent, PagenotfoundComponent, ShoppingCartComponent} from "./shared";
import {AccessDeniedPageComponent} from "./shared/components/access-denied-page/access-denied-page.component";


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', component: HomepageComponent},
      {path: 'access-denied', component: AccessDeniedPageComponent},
      {path: 'shopping-cart', component: ShoppingCartComponent},
      {path: 'auth', loadChildren: () => import('./modules').then(value => value.AuthModule)},
      {path: 'users', loadChildren: () => import('./modules').then(value => value.UserModule)},
      {path: 'tags', loadChildren: () => import('./modules').then(value => value.TagModule)},
      {path: 'certificates', loadChildren: () => import('./modules').then(value => value.CertificateModule)},
      {path: 'orders', loadChildren: () => import('./modules').then(value => value.OrderModule)},
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
