import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminProfileRoutingModule } from './admin-profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    ProfileComponent,
    ViewProfileComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    AdminProfileRoutingModule,
    AdminSharedModule
  ]
})
export class AdminProfileModule { }
