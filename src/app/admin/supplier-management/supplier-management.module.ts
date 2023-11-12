import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierManagementRoutingModule } from './supplier-management-routing.module';
import { NewSupplierComponent } from './pages/new-supplier/new-supplier.component';
import { ListSuppliersComponent } from './pages/list-suppliers/list-suppliers.component';
import { ListSupplierComponent } from './pages/list-supplier/list-supplier.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    NewSupplierComponent,
    ListSuppliersComponent,
    ListSupplierComponent
  ],
  imports: [
    CommonModule,
    SupplierManagementRoutingModule,
    AdminSharedModule
  ]
})
export class SupplierManagementModule { }
