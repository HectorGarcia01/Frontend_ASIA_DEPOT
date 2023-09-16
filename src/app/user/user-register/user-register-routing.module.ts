import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingUpComponent } from './pages/sing-up/sing-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },

  {
    path: 'signup',
    component: SingUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRegisterRoutingModule { }
