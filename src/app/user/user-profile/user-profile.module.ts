import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { UserSharedModule } from '../shared/user-shared.module';

@NgModule({
  declarations: [
    ProfileComponent,
    ViewProfileComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    UserSharedModule
  ]
})
export class UserProfileModule { }
