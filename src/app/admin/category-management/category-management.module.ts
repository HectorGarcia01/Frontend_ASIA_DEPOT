import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { NewCategoryComponent } from './pages/new-category/new-category.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { ListCategoryComponent } from './pages/list-category/list-category.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    NewCategoryComponent,
    ListCategoriesComponent,
    ListCategoryComponent
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
