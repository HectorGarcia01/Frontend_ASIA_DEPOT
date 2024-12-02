import { Component, OnInit } from '@angular/core';
import { ReviewsService } from 'src/app/user/services/reviews.service';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-reviews-section',
  templateUrl: './reviews-section.component.html',
  styleUrls: ['./reviews-section.component.css']
})
export class ReviewsSectionComponent implements OnInit{
  productReviews: any = [];
  noneReviews: boolean = false;
  image: any = 'assets/transparent.png';
  images: any = [];

  constructor(
    private reviewsService: ReviewsService,
    private userService: UserServicesService
  ) { }

  ngOnInit() {
    this.getReviews();
  }

  /**
   * Función para consumir el servicio de ver reseñas
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerProfile del servicio de usuarios (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getReviews() {
    try {
      this.reviewsService.getAllReviews(`${apiURL}/usuario/ver/valoraciones/productos`).subscribe({
        next: (data: any) => {
          this.productReviews = data.productReviews;

          this.productReviews.forEach((review: any) => {
            if (review.createdAt) {
              const createdDate = review.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              review.createdAt = newDateCreate;
            }

            if (review.Puntuacion_Producto === 1) {
              review.Puntuacion_Producto = `${review.Puntuacion_Producto} estrella`;
            }
            review.Puntuacion_Producto = `${review.Puntuacion_Producto} estrellas`;
            this.getPhotos(review.cliente.id);
          });

          this.noneReviews = true;
        },
        error: (error: any) => {
          this.noneReviews = false;
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver la foto de perfil del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getPhotos del servicio de usuarios (user-services.service)   
   */

  getPhotos(id: any) {
    try {
      this.userService.getPhotos(`${apiURL}/usuario/ver/avatar`, id).subscribe({
        next: (data: Blob) => {
          this.images.push(URL.createObjectURL(data));
        },
        error: (error: any) => {
          this.images.push('assets/perfil_picture.png');
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
