import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivateAccountService } from '../../services/activate-account.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  activateForm!: FormGroup;
  loading = false;

  constructor(
    private activateAccountService: ActivateAccountService,
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
    this.activateForm = new FormGroup({
      token: new FormControl('', [Validators.required])
    });
  }

  /**
   * Función para realizar una solicitud post para activar la cuenta de usuario
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función activateAccount del servicio de autenticación (activate-account.service)
   */

  onSubmit() {
    try {
      if (this.activateForm.valid) {
        this.loading = true;
        const token = this.activateForm.get('token')?.value;

        this.activateAccountService.activateAccount(`${apiURL}/usuario/activar/cuenta`, token).subscribe({
          next: (data: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
            this.loading = false;
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            console.log(error);
            this.customAlertService.sweetAlertPersonalizada('error', "Error", "El token es inválido");
            this.loading = false;
          }
        })
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Campo vacío", "Para activar tu cuenta debes ingresar el token.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
