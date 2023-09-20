import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { UserSharedModule } from '../shared/user-shared.module';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  declarations: [
    HomeComponent,
    ContactUsComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    UserHomeRoutingModule,
    UserSharedModule
  ]
})
export class UserHomeModule { }
