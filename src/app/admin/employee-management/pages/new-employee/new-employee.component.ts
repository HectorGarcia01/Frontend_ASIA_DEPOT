import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EmployeeManagementService } from 'src/app/admin/services/employee-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { addEmployee } from 'src/app/admin/interfaces/employee.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  registerForm!: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private employeeService: EmployeeManagementService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) {
    this.toggleNavbarStatus();
    this.validateForm();
  }

  ngOnInit() {
    
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
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^[345][0-9]{7}$/)]),
      nit: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s).*$/), Validators.minLength(8), Validators.maxLength(25)]),
      repetir_password: new FormControl('', [Validators.required])
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  /**
   * Función privada para validar si las contraseñas coinciden
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repetir_password')?.value;

    if (password === repeatPassword) {
      return null;
    } else {
      return { passwordsNotMatch: true };
    }
  }

  /**
   * Función para obtener todos los datos del formulario reactivo
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  getAdminData() {
    const newEmployee: addEmployee = {
      Nombre_Empleado: this.registerForm.get('nombre')?.value,
      Apellido_Empleado: this.registerForm.get('apellido')?.value,
      Telefono_Empleado: this.registerForm.get('telefono')?.value,
      NIT_Empleado: this.registerForm.get('nit')?.value,
      Correo_Empleado: this.registerForm.get('correo')?.value,
      Password_Empleado: this.registerForm.get('password')?.value,
      Repetir_Password_Empleado: this.registerForm.get('repetir_password')?.value
    };

    for (const key in newEmployee) {
      if (newEmployee.hasOwnProperty(key) && (newEmployee[key] === null || newEmployee[key] === undefined || newEmployee[key] === '')) {
        delete newEmployee[key];
      }
    }

    if (Object.keys(newEmployee).length === 0) {
      return null;
    }

    return newEmployee;
  }

  /**
   * Función para consumir el servicio de registro de nuevo admin
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createEmployee del servicio de empleado (employee-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    this.submitted = true;
    
    if (this.registerForm.valid) {
      this.loading = true;
      const password = this.registerForm.get('password')?.value;
      const repeatPassword = this.registerForm.get('repetir_password')?.value;

      if (password === repeatPassword) {
        const adminData = this.getAdminData();

        this.employeeService.createEmployee(`${apiURL}/superAdmin/nuevo/empleado`, adminData).subscribe({
          next: (response: any) => {
            this.registerForm.reset();
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.loading = false;
            this.router.navigate(['/admin/list/admins']);
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', error.error.error, "Por favor, intenta con otro correo.");
          }
        });
      } else {
        this.registerForm.get('repetir_password')?.setErrors({ passwordsNotMatch: true });
      }
    } else {
      this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
    }
  }
}
