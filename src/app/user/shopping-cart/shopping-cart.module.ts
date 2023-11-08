import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { UserSharedModule } from '../shared/user-shared.module';

@NgModule({
  declarations: [
    ShoppingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ShoppingCartRoutingModule,
    UserSharedModule
  ]
})
export class ShoppingCartModule { }
