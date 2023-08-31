import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { UserSharedModule } from '../shared/user-shared.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    UserHomeRoutingModule,
    UserSharedModule
  ]
})
export class UserHomeModule { }
