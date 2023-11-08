import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { UserSharedModule } from '../user/shared/user-shared.module';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';


@NgModule({
  declarations: [
    LoginComponent,
    ActivateAccountComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    UserSharedModule
  ]
})
export class AuthModule { }
