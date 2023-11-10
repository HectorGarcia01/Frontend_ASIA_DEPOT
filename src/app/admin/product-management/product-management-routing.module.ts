import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { ListProductsComponent } from './pages/list-products/list-products.component';
import { ListProductComponent } from './pages/list-product/list-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'create/product', pathMatch: 'full' },

  {
    path: 'create/product',
    component: NewProductComponent,
  },
  {
    path: 'list/products',
    component: ListProductsComponent,
  },
  {
    path: 'view/product/:id',
    component: ListProductComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagementRoutingModule { }
