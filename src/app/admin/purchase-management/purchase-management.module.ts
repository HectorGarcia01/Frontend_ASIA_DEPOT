import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseManagementRoutingModule } from './purchase-management-routing.module';
import { NewPurchaseComponent } from './pages/new-purchase/new-purchase.component';
import { ListPurchasesComponent } from './pages/list-purchases/list-purchases.component';
import { ListPurchaseComponent } from './pages/list-purchase/list-purchase.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    NewPurchaseComponent,
    ListPurchasesComponent,
    ListPurchaseComponent
  ],
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule,
    AdminSharedModule
  ]
})
export class PurchaseManagementModule { }
