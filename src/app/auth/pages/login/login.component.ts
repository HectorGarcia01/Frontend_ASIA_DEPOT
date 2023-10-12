import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { apiURL } from 'src/app/config/config';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { SingIn } from '../../interfaces/login.interface';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // employeeData: getEmployee[] = [];
  customerData: getCustomer[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) {
    this.validateForm();
  }

  ngOnInit() {
    
  }

  private validateForm() {
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  singIn() {
    if (this.loginForm.valid) {
      const signIn: SingIn = {
        correo: this.loginForm.get('correo')?.value,
        password: this.loginForm.get('password')?.value
      }

      this.authService.singIn(`${apiURL}/usuario/login`, signIn).subscribe((data: any) => {
          this.authService.saveCookieAuth();
          if (data.userRole === 'Admin' || data.userRole === 'SuperAdmin') {
            // this.employeeData = data.user;
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", `Bienvenido ${data.user.Nombre_Empleado} ${data.user.Apellido_Empleado}`);
            this.router.navigate(['/admin']);
          } else {
            this.customerData = data.user;
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", `Bienvenido ${data.user.Nombre_Cliente} ${data.user.Apellido_Cliente}`);
            this.router.navigate(['/home']);
          }
      }, (error:any) => {
        console.log(error.error);
        this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
      });
    }
  }
}
