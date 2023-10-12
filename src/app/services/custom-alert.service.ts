import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {

  constructor() { }

  /**
   * Función para la creación de una alerta personalizada
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  sweetAlertPersonalizada(icono: any, titulo: any, message: any) {
    Swal.fire({
      icon: icono,
      title: titulo,
      text: message,
      showConfirmButton: false,
      timer: 3000
    });
  }
}
