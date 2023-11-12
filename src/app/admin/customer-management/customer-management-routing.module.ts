import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCustomerComponent } from './pages/list-customer/list-customer.component';
import { ListCustomersComponent } from './pages/list-customers/list-customers.component';

const routes: Routes = [
  { path: '', redirectTo: 'list/customers', pathMatch: 'full' },

  {
    path: 'list/customers',
    component: ListCustomersComponent,
  },
  {
    path: 'view/customer/:id/:name',
    component: ListCustomerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
