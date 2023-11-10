import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEmployeeComponent } from './pages/new-employee/new-employee.component';
import { ListEmployeesComponent } from './pages/list-employees/list-employees.component';
import { ListEmployeeComponent } from './pages/list-employee/list-employee.component';

const routes: Routes = [
  { path: '', redirectTo: 'create/employee', pathMatch: 'full' },

  {
    path: 'create/employee',
    component: NewEmployeeComponent,
  },
  {
    path: 'list/employees',
    component: ListEmployeesComponent,
  },
  {
    path: 'view/employee/:id',
    component: ListEmployeeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
