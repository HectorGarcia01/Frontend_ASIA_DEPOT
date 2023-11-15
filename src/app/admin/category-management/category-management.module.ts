import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { NewCategoryComponent } from './pages/new-category/new-category.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';

@NgModule({
  declarations: [
    NewCategoryComponent,
    ListCategoriesComponent,
    UpdateCategoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CategoryManagementRoutingModule,
    AdminSharedModule
  ]
})
export class CategoryManagementModule { }
