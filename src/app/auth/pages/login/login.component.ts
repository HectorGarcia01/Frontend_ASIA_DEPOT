import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { apiURL } from 'src/app/config/config';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { SingIn } from '../../interfaces/login.interface';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';
import { getEmployee } from 'src/app/admin/interfaces/employee.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  employeeData!: getEmployee;
  customerData!: getCustomer;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) {
    this.validateForm();
  }

  ngOnInit() {
    this.scrollToTop();
  }

  /**
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */
  private validateForm() {
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  /**
   * Función para consumir el servicio de inicio de sesión
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función singIn del servicio de autenticación (auth.service),
   *            Función saveCookieAuth del servicio de autenticación (auth.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   *            
   */

  singIn() {
    try {
      if (this.loginForm.valid) {
        this.loading = true;
        const signIn: SingIn = {
          correo: this.loginForm.get('correo')?.value,
          password: this.loginForm.get('password')?.value
        }

        this.authService.singIn(`${apiURL}/usuario/login`, signIn).subscribe({
          next: (data: any) => {
            this.authService.saveCookieAuth(data.userToken);
            this.authService.saveCookieRole(data.userRole);
            this.loading = false;
            if (data.userRole === 'Admin' || data.userRole === 'SuperAdmin') {
              this.employeeData = data.user;
              this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", `Bienvenido ${this.employeeData.Nombre_Empleado} ${this.employeeData.Apellido_Empleado}`);
              this.router.navigate(['/admin']);
            } else {
              this.customerData = data.user;
              this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", `Bienvenido ${this.customerData.Nombre_Cliente} ${this.customerData.Apellido_Cliente}`);
              this.router.navigate(['/home']);
            }
          },
          error: (error: any) => {
            this.loading = false;
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Todos los campos son obligatorios");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
