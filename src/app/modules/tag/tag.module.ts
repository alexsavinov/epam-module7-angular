import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TagRoutingModule} from './tag-routing.module';
import {MaterialModule} from '../../shared';
import {TagComponent, TagsComponent} from './components';


@NgModule({
  declarations: [
    TagsComponent,
    TagComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TagModule {
}
