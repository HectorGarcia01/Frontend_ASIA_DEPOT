import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { apiURL } from 'src/app/config/config';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customer: getCustomer = {} as getCustomer;
  image: any;

  constructor(
    private authService: AuthService,
    private userService: UserServicesService
  ) { }

  ngOnInit(){
    this.viewProfile();
    this.getProfilePicture();
  }

  /**
   * Función para consumir el servicio de ver perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerProfile del servicio de usuarios (user-services.service)   
   */

  viewProfile() {
    this.userService.getCustomerProfile(`${apiURL}/usuario/ver/perfil`).subscribe((data: any) => {
      this.customer = data.customer;
    });
  }

  getProfilePicture() {
    try {
      if (this.authService.isAuthenticated()) {
        this.userService.getProfilePhoto(`${apiURL}/usuario/ver/avatar`).subscribe({
          next: (data: Blob) => {
            this.image = URL.createObjectURL(data);
          },
          error: (error: any) => {
            this.image = 'assets/perfil_picture.png';
          }
        })
      } else {
        this.image = 'assets/perfil_picture.png';
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }
}