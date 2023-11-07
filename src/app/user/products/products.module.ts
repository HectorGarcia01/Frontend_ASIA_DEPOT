import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { UserSharedModule } from '../shared/user-shared.module';
import { ProductReviewsComponent } from './pages/product-reviews/product-reviews.component';

@NgModule({
  declarations: [
  
    ProductListComponent,
    ProductDetailComponent,
    ProductReviewsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductsRoutingModule,
    UserSharedModule
  ]
})
export class ProductsModule { }
