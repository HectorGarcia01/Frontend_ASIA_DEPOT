import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { ListCustomersComponent } from './pages/list-customers/list-customers.component';
import { ListCustomerComponent } from './pages/list-customer/list-customer.component';
import { DeleteCustomerComponent } from './pages/delete-customer/delete-customer.component';
import { AdminSharedModule } from '../shared/admin-shared.module';


@NgModule({
  declarations: [
    ListCustomersComponent,
    ListCustomerComponent,
    DeleteCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerManagementRoutingModule,
    AdminSharedModule
  ]
})
export class CustomerManagementModule { }
