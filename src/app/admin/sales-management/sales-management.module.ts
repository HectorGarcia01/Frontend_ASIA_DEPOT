import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesManagementRoutingModule } from './sales-management-routing.module';
import { ListSalesComponent } from './pages/list-sales/list-sales.component';
import { ListSaleComponent } from './pages/list-sale/list-sale.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    ListSalesComponent,
    ListSaleComponent
  ],
  imports: [
    CommonModule,
    SalesManagementRoutingModule,
    AdminSharedModule
  ]
})
export class SalesManagementModule { }
