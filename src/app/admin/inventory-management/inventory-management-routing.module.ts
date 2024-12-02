import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInventoriesComponent } from './pages/list-inventories/list-inventories.component';
import { ListInventoryComponent } from './pages/list-inventory/list-inventory.component';
import { AdjustInventoryComponent } from './pages/adjust-inventory/adjust-inventory.component';

const routes: Routes = [
  { path: '', redirectTo: 'list/inventories', pathMatch: 'full' },

  {
    path: 'list/inventories',
    component: ListInventoriesComponent,
  },
  {
    path: 'view/inventory/:id',
    component: ListInventoryComponent,
  },
  {
    path: 'adjust/inventory/create/product',
    component: AdjustInventoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule { }
