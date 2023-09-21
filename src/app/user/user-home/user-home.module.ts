import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { UserSharedModule } from '../shared/user-shared.module';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesSectionComponent } from './components/categories-section/categories-section.component';
import { ProductOffersSectionComponent } from './components/product-offers-section/product-offers-section.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';
import { ReviewsSectionComponent } from './components/reviews-section/reviews-section.component';

@NgModule({
  declarations: [
    HomeComponent,
    ContactUsComponent,
    AboutComponent,
    CategoriesSectionComponent,
    ProductOffersSectionComponent,
    ProductsSectionComponent,
    ReviewsSectionComponent
  ],
  imports: [
    CommonModule,
    UserHomeRoutingModule,
    UserSharedModule
  ]
})
export class UserHomeModule { }
