import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {

  constructor() { }

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
