import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { EmployeeManagementService } from 'src/app/admin/services/employee-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getEmployee } from 'src/app/admin/interfaces/employee.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  employee: getEmployee = {} as getEmployee;
  image: any = 'assets/transparent.png';
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private route: ActivatedRoute,
    private employeeService: EmployeeManagementService,
    private customAlertService: CustomAlertService
  ) {
    this.toggleNavbarStatus();
  }

  ngOnInit() {
    this.getParamsId();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleNavbarStatus() {
    this.subscription = this.toggleNavBarService.sidebarVisibility$.subscribe((isVisible) => {
      this.sidebarVisible = isVisible;

      const contentElement = document.getElementById('contentMove');

      if (contentElement) {
        if (this.sidebarVisible) {
          contentElement.style.width = 'calc(100% - 280px)';
          contentElement.style.left = '280px';
        } else {
          contentElement.style.width = '100%';
          contentElement.style.left = '0';
        }
      }
    });
  }

  /**
   * Función para obtener el id de los parámetros de la url
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId que consume el servicio del backend
   */

  getParamsId() {
    this.route.paramMap.subscribe(params => {
      const employeeId = params.get('id');

      if (employeeId) {
        this.getEmployee(employeeId);
      }
    });
  }

  /**
   * Función para consumir el servicio de ver un empleado (Admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getEmployeeId del servicio de empleado (employee-management.service)   
   */

  getEmployee(id: any) {
    try {
      this.employeeService.getEmployeeId(`${apiURL}/superAdmin/ver/empleado`, id).subscribe({
        next: (data: any) => {
          this.employee = data.employee;

          if (this.employee.createdAt) {
            const createdDate = this.employee.createdAt;
            const parts = createdDate.split('T');
            const newDateCreate = parts[0];

            this.employee.createdAt = newDateCreate;
          }

          this.getAdminAvatar(this.employee.id);
          this.error404 = false;
        },
        error: (error: any) => {
          this.error404 = true;
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver la foto de perfil de cada empleado (Admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getPhotos del servicio de empleado (employee-management.service)   
   */

  getAdminAvatar(id: any) {
    try {
      this.employeeService.getPhotos(`${apiURL}/superAdmin/ver/avatars`, id).subscribe({
        next: (data: Blob) => {
          this.image = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.image = 'assets/perfil_picture.png';
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio para eliminar un empleado (Admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteEmployee del servicio de empleado (employee-management.service)   
   */

  deleteEmployee(id: any) {
    try {
      this.employeeService.deleteEmployee(`${apiURL}/superAdmin/eliminar/empleado`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getParamsId();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de activar un empleado (Admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función activateEmployee del servicio de empleado (employee-management.service)   
   */

  activateEmployee(id: any) {
    try {
      this.employeeService.activateEmployee(`${apiURL}/superAdmin/activar/empleado`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getParamsId();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
