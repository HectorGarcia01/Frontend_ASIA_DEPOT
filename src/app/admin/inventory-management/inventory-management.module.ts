import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { ListInventoriesComponent } from './pages/list-inventories/list-inventories.component';
import { ListInventoryComponent } from './pages/list-inventory/list-inventory.component';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { AdjustInventoryComponent } from './pages/adjust-inventory/adjust-inventory.component';

@NgModule({
  declarations: [
    ListInventoriesComponent,
    ListInventoryComponent,
    AdjustInventoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InventoryManagementRoutingModule,
    AdminSharedModule
  ]
})
export class InventoryManagementModule { }
