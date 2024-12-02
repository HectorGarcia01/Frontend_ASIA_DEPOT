import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ListProductsComponent } from './pages/list-products/list-products.component';
import { ListProductComponent } from './pages/list-product/list-product.component';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    ListProductsComponent,
    ListProductComponent,
    NewProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductManagementRoutingModule,
    AdminSharedModule
  ]
})
export class ProductManagementModule { }
