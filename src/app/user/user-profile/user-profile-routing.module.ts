import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'profile/view',
    component: ViewProfileComponent
  },
  {
    path: 'profile/update',
    component: UpdateProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
