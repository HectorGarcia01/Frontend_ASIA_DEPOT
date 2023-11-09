import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCategoryComponent } from './pages/new-category/new-category.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { ListCategoryComponent } from './pages/list-category/list-category.component';

const routes: Routes = [
  { path: '', redirectTo: 'create/category', pathMatch: 'full' },

  {
    path: 'create/category',
    component: NewCategoryComponent,
  },
  {
    path: 'list/categories',
    component: ListCategoriesComponent,
  },
  {
    path: 'view/category/:id',
    component: ListCategoryComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryManagementRoutingModule { }
