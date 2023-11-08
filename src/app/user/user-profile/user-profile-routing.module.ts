import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { FavoriteProductsComponent } from './pages/favorite-products/favorite-products.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'profile/update',
    component: UpdateProfileComponent
  },
  {
    path: 'profile/favorite/products',
    component: FavoriteProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
