import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserRegisterRoutingModule } from './user-register-routing.module';
import { SingUpComponent } from './pages/sing-up/sing-up.component';
import { UserSharedModule } from '../shared/user-shared.module';

@NgModule({
  declarations: [
    SingUpComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserRegisterRoutingModule,
    UserSharedModule,
  ]
})
export class UserRegisterModule { }
