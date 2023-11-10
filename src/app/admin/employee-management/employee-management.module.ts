import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { ListEmployeesComponent } from './pages/list-employees/list-employees.component';
import { ListEmployeeComponent } from './pages/list-employee/list-employee.component';
import { NewEmployeeComponent } from './pages/new-employee/new-employee.component';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    ListEmployeesComponent,
    ListEmployeeComponent,
    NewEmployeeComponent
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
    AdminSharedModule
  ]
})
export class EmployeeManagementModule { }
