import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { UserSharedModule } from '../shared/user-shared.module';
import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';

@NgModule({
  declarations: [
  
    ProductListComponent,
    ProductDetailComponent,
    ProductReviewsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    UserSharedModule
  ]
})
export class ProductsModule { }
