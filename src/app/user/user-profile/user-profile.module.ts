import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ViewProfileComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
