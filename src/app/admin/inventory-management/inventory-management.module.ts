import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { ListInventoriesComponent } from './pages/list-inventories/list-inventories.component';
import { ListInventoryComponent } from './pages/list-inventory/list-inventory.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    ListInventoriesComponent,
    ListInventoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InventoryManagementRoutingModule,
    AdminSharedModule
  ]
})
export class InventoryManagementModule { }
