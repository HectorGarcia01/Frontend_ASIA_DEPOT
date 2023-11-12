import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSalesComponent } from './pages/list-sales/list-sales.component';
import { ListSaleComponent } from './pages/list-sale/list-sale.component';

const routes: Routes = [
  { path: '', redirectTo: 'list/sales', pathMatch: 'full' },

  {
    path: 'list/sales',
    component: ListSalesComponent,
  },
  {
    path: 'view/sale/:id',
    component: ListSaleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesManagementRoutingModule { }
