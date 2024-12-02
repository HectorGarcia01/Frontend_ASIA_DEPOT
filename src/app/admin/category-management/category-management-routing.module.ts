import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCategoryComponent } from './pages/new-category/new-category.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';

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
    path: 'update/category/:id/:name',
    component: UpdateCategoryComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryManagementRoutingModule { }
