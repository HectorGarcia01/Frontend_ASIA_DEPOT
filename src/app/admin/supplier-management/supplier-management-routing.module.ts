import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSupplierComponent } from './pages/new-supplier/new-supplier.component';
import { ListSuppliersComponent } from './pages/list-suppliers/list-suppliers.component';
import { ListSupplierComponent } from './pages/list-supplier/list-supplier.component';

const routes: Routes = [
  { path: '', redirectTo: 'create/supplier', pathMatch: 'full' },

  {
    path: 'create/supplier',
    component: NewSupplierComponent,
  },
  {
    path: 'list/suppliers',
    component: ListSuppliersComponent,
  },
  {
    path: 'view/supplier/:id',
    component: ListSupplierComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierManagementRoutingModule { }
