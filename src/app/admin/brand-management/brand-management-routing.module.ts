import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewBrandComponent } from './pages/new-brand/new-brand.component';
import { ListBrandsComponent } from './pages/list-brands/list-brands.component';
import { UpdateBrandComponent } from './pages/update-brand/update-brand.component';
const routes: Routes = [
  { path: '', redirectTo: 'create/brand', pathMatch: 'full' },

  {
    path: 'create/brand',
    component: NewBrandComponent,
  },
  {
    path: 'list/brands',
    component: ListBrandsComponent,
  },
  {
    path: 'update/brand/:id/:name',
    component: UpdateBrandComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandManagementRoutingModule { }
