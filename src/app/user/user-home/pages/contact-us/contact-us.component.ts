import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private userService: UserServicesService,
    private authService: AuthService,
    private customAlertService: CustomAlertService
  ) { 
    this.validateForm();
  }

  ngOnInit() {

  }

  /**
     * Función privada para la definición de un formulario reactivo
     * Fecha creación: 06/10/2023
     * Autor: Hector Armando García González
     */

  private validateForm() {
    this.contactForm = new FormGroup({
      Nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      Correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      Asunto: new FormControl('', [Validators.required, Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(50)]),
      Mensaje: new FormControl('', [Validators.required, Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(200)])
    });
  }

  /**
   * Función para consumir el servicio contáctanos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función addCustomer del servicio de usuario (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    if (!this.authService.isAuthenticated()) {
      return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Primero debes de iniciar sesión.");
    }

    if (this.contactForm.valid) {
      const userData = {
        Nombre: this.contactForm.get('Nombre')?.value,
        Correo: this.contactForm.get('Correo')?.value,
        Asunto: this.contactForm.get('Asunto')?.value,
        Mensaje: this.contactForm.get('Mensaje')?.value,
      };

      this.userService.contactUs(`${apiURL}/usuario/contactanos`, userData).subscribe({
          next: (response: any) => {
            this.contactForm.reset();
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
    } else {
      this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
    }
  }
}
