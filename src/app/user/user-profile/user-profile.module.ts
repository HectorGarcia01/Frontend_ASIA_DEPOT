import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { UserSharedModule } from '../shared/user-shared.module';
import { FavoriteProductsComponent } from './pages/favorite-products/favorite-products.component';

@NgModule({
  declarations: [
    ProfileComponent,
    UpdateProfileComponent,
    FavoriteProductsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserProfileRoutingModule,
    UserSharedModule
  ]
})
export class UserProfileModule { }
