import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../admin-home/pages/home/home.component';
import { ListCustomerComponent } from './pages/list-customer/list-customer.component';
import { ListCustomersComponent } from './pages/list-customers/list-customers.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: HomeComponent,
  },
  {
    path: 'dashboard/list/customers',
    component: ListCustomersComponent,
  },
  {
    path: 'dashboard/list/customer',
    component: ListCustomerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
