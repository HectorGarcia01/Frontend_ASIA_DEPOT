import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPurchaseComponent } from './pages/new-purchase/new-purchase.component';
import { ListPurchasesComponent } from './pages/list-purchases/list-purchases.component';
import { ListPurchaseComponent } from './pages/list-purchase/list-purchase.component';

const routes: Routes = [
  { path: '', redirectTo: 'create/employee', pathMatch: 'full' },

  {
    path: 'create/purchase',
    component: NewPurchaseComponent,
  },
  {
    path: 'list/purchases',
    component: ListPurchasesComponent,
  },
  {
    path: 'view/purchase/:id',
    component: ListPurchaseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
