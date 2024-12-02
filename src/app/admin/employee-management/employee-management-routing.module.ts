import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEmployeeComponent } from './pages/new-employee/new-employee.component';
import { ListEmployeesComponent } from './pages/list-employees/list-employees.component';
import { ListEmployeeComponent } from './pages/list-employee/list-employee.component';

const routes: Routes = [
  { path: '', redirectTo: 'create/admin', pathMatch: 'full' },

  {
    path: 'create/admin',
    component: NewEmployeeComponent,
  },
  {
    path: 'list/admins',
    component: ListEmployeesComponent,
  },
  {
    path: 'view/admin/:id/:name',
    component: ListEmployeeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
