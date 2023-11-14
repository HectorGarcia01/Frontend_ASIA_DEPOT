import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { EmployeeManagementService } from 'src/app/admin/services/employee-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getEmployee } from 'src/app/admin/interfaces/employee.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  employees: getEmployee[] = [];
  employeeImages: { [key: number]: string } = {};
  image: any = 'assets/transparent.png';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private employeeService: EmployeeManagementService,
    private customAlertService: CustomAlertService
  ) {
    this.toggleNavbarStatus();
  }

  ngOnInit() {
    this.scrollToTop();
    this.getEmployees();
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
   * Función para consumir el servicio de ver todos los empleados (Admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getEmployees del servicio de empleado (employee-management.service)   
   */

  getEmployees() {
    try {
      this.employeeService.getEmployees(`${apiURL}/superAdmin/ver/empleados`).subscribe({
        next: (data: any) => {
          this.employees = data.employees;
          
          this.employees.forEach((employee: any) => {
            if (employee.createdAt) {
              const createdDate = employee.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              employee.createdAt = newDateCreate;
            }

            this.getPhotos(employee.id);
          });
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.searchEmployee(this.searchQuery);
  }

  searchEmployee(query: string) {
    try {
      this.employeeService.getEmployees(`${apiURL}/superAdmin/ver/empleados?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.employees = data.employees;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.employees.forEach((employee: any) => {
            if (employee.createdAt) {
              const createdDate = employee.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              employee.createdAt = newDateCreate;
            }

            this.getPhotos(employee.id);
          });
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      });
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

  getPhotos(id: any) {
    try {
      this.employeeService.getPhotos(`${apiURL}/superAdmin/ver/avatars`, id).subscribe({
        next: (data: Blob) => {
          this.employeeImages[id] = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.employeeImages[id] = 'assets/perfil_picture.png';
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de eliminar un empleado (Admin)
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
          this.getEmployees();
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
          this.getEmployees();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  getEmployeeName(employee: any): string {
    return employee.Nombre_Empleado.toLowerCase().replace(/ /g, '-');
  }

  /**
   * Función para cambiar de página
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomers
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getEmployees();
      this.scrollToTop();
    }
  }

  /**
   * Función para cambiar el número de registros
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomers
   */

  changePageSize(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.pageSize = +element.value;
    this.currentPage = 1;
    this.getEmployees();
  }

  /**
   * Función para obtener el número de páginas
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  getPagesArray(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
