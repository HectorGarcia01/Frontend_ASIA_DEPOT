import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SupplierManagementRoutingModule } from './supplier-management-routing.module';
import { NewSupplierComponent } from './pages/new-supplier/new-supplier.component';
import { ListSuppliersComponent } from './pages/list-suppliers/list-suppliers.component';
import { ListSupplierComponent } from './pages/list-supplier/list-supplier.component';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { UpdateSupplierComponent } from './pages/update-supplier/update-supplier.component';

@NgModule({
  declarations: [
    NewSupplierComponent,
    ListSuppliersComponent,
    ListSupplierComponent,
    UpdateSupplierComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SupplierManagementRoutingModule,
    AdminSharedModule
  ]
})
export class SupplierManagementModule { }
