import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/user/services/product.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { ReviewsService } from 'src/app/user/services/reviews.service';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Product } from 'src/app/user/interfaces/product.interface';
import { Category } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit {
  registerForm!: FormGroup;
  product: Product = {} as Product;
  category: Category = {} as Category;
  productReviews: any = [];
  increment: number = 1;
  noneReviews: boolean = false;
  image: any = 'assets/transparent.png';
  images: any = [];
  countReviews: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private reviewsService: ReviewsService,
    private userService: UserServicesService,
    private customAlertService: CustomAlertService
  ) { 
    this.validateForm();
  }

  ngOnInit() {
    this.getParamsId();
  }

  /**
   * Función para obtener el id de los parámetros de la url
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId que consume el servicio del backend
   */

  getParamsId() {
    this.route.paramMap.subscribe(params => {
      const IdProduct = params.get('id');

      if (IdProduct) {
        this.getProductId(IdProduct);
        this.getReviews(IdProduct);
      }
    });
  }

  /**
   * Función para consumir servicio de obtener un producto por Id
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId del servicio de productos (product.service)
   */

  getProductId(IdProduct: string) {
    this.productService.getProductId(`${apiURL}/usuario/ver/producto/${IdProduct}`).subscribe((data: any) => {
      this.product = data.product;
      this.category = data.product.categoria;
    });
  }

  /**
   * Función para consumir servicio para agregar un producto al carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función addProductCart del servicio de productos (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit(ID_Producto_FK: number) {
    try {
      if (!this.authService.isAuthenticated()) {
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para agregar un producto al carrito primero debes de iniciar sesión.");
      }

      const body = { ID_Producto_FK, Cantidad_Producto: this.increment };
      this.shoppingCartService.addProductCart(`${apiURL}/usuario/carrito/agregar`, body).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getParamsId();
          this.increment = 1;
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Lo siento", `No hay sufiente stock de "${this.product.Nombre_Producto}"`);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.registerForm = new FormGroup({
      puntuacion: new FormControl('', [Validators.required, Validators.pattern('^[0-5]')]),
      comentario: new FormControl('', [Validators.required, Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(200)]),
    });
  }

  /**
   * Función para consumir el servicio de registro de nuevo cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función addCustomer del servicio de usuario (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  addProductReview(ID_Producto_FK: number) { 
    try {
      if (!this.authService.isAuthenticated()) {
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para agregar una reseña primero debes de iniciar sesión.");
      } 

      if (this.registerForm.valid) {
        const body = {
          Comentario_Producto: this.registerForm.get('comentario')?.value,
          Puntuacion_Producto: this.registerForm.get('puntuacion')?.value,
          ID_Producto_FK
        }
        this.reviewsService.addReview(`${apiURL}/usuario/nueva/valoracion/producto`, body).subscribe({
          next: (response: any) => {
            this.registerForm.reset();
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.getReviews(ID_Producto_FK);
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver reseñas
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerProfile del servicio de usuarios (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getReviews(id: any) {
    try {
      this.reviewsService.getReviews(`${apiURL}/usuario/ver/todas/valoraciones/producto`, id).subscribe({
        next: (data: any) => {
          this.productReviews = data.productReviews;
          this.countReviews = this.productReviews.length;
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

  decreaseQuantity() {
    if (this.increment > 1) {
      this.increment--;
    }
  }

  increaseQuantity() {
    if (this.increment < this.product.Cantidad_Stock) {
      this.increment++;
    } else {
      this.customAlertService.sweetAlertPersonalizada('error', "Lo siento", `No hay sufiente stock de "${this.product.Nombre_Producto}"`);
    }
  }
}
