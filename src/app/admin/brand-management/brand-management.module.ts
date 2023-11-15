import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BrandManagementRoutingModule } from './brand-management-routing.module';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { NewBrandComponent } from './pages/new-brand/new-brand.component';
import { ListBrandsComponent } from './pages/list-brands/list-brands.component';
import { UpdateBrandComponent } from './pages/update-brand/update-brand.component';


@NgModule({
  declarations: [
    NewBrandComponent,
    ListBrandsComponent,
    UpdateBrandComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminSharedModule,
    BrandManagementRoutingModule
  ]
})
export class BrandManagementModule { }
