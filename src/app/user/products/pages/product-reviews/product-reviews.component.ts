import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/user/services/product.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { ReviewsService } from 'src/app/user/services/reviews.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Product } from 'src/app/user/interfaces/product.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit {
  registerForm!: FormGroup;
  product: Product = {} as Product;
  productReviews: any = [];
  increment: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private reviewsService: ReviewsService,
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
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
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
      puntuacion: new FormControl('', [Validators.pattern('^[0-5]')]),
      comentario: new FormControl('', [Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(200)]),
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

          this.productReviews.forEach((review: any) => {
            if (review.createdAt) {
              const createdDate = review.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              review.createdAt = newDateCreate;
            }
          });        
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      });
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
    this.increment++;
  }
}
