import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { UserSharedModule } from '../shared/user-shared.module';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';

@NgModule({
  declarations: [
  
    ProductListComponent,
    ProductDetailComponent,
    ProductDescriptionComponent,
    ProductReviewsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    UserSharedModule
  ]
})
export class ProductsModule { }
