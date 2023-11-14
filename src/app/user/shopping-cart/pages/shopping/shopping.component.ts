import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  registerForm!: FormGroup;
  shoppingDetailCart: any = {};
  shipping_type: any = [];
  payment_method: any = [];
  customer: getCustomer = {} as getCustomer;
  noneProducts: boolean = false;
  loading = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private userService: UserServicesService,
    private customAlertService: CustomAlertService
  ) { 
    this.validateForm();
  }

  ngOnInit() {
    this.getShoppingCart();
  }

  /**
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.registerForm = new FormGroup({
      tipo_envio: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$')]),
      metodo_pago: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$')])
    });
  }

  /**
   * Función para consumir servicio para ver el detalle del carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getShoppingCart del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getShoppingCart() {
    try {
      this.shoppingCartService.getShoppingCart(`${apiURL}/usuario/carrito/ver`).subscribe({
        next: (data: any) => {
          this.shoppingDetailCart = data.shoppingDetailCart;
          this.shoppingDetailCart.Total_Factura = this.shoppingDetailCart.Total_Factura.toFixed(2);
          this.getProfile();
          this.getShipmentInformation();
          if (this.shoppingDetailCart.detalles_venta.length === 0) {
            this.noneProducts = false;
          } else {
            this.noneProducts = true;
          }
        },
        error: (error: any) => {
          this.noneProducts = false;
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerProfile del servicio de usuarios (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getProfile() {
    try {
      this.userService.getCustomerProfile(`${apiURL}/usuario/ver/perfil`).subscribe({
        next: (data: any) => {
          this.customer = data.customer;
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
   * Función para consumir el servicio de ver la información de envío
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getShipmentInformation del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getShipmentInformation() {
    try {
      this.shoppingCartService.getShipmentInformation(`${apiURL}/usuario/ver/tipo/envio`).subscribe({
        next: (data: any) => {
          this.shipping_type = data.shipping_type;
          this.payment_method = data.payment_method;
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
   * Función para consumir servicio para actualizar un producto del carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función updateProductCart del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  updateProductCart(ID_Producto_FK: number, Cantidad_Producto: number) {
    try {
      const body = { ID_Producto_FK, Cantidad_Producto };
      this.shoppingCartService.updateProductCart(`${apiURL}/usuario/carrito/actualizar/producto`, body).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getShoppingCart();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          this.getShoppingCart();
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio para eliminar un producto del carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función deleteProductCart del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  deleteProductCart(id: number) {
    try {
      this.shoppingCartService.deleteProductCart(`${apiURL}/usuario/carrito/eliminar/producto`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getShoppingCart();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio para eliminar el carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función deleteShoppingCart del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  deleteShoppingCart() {
    try {
      this.shoppingCartService.deleteShoppingCart(`${apiURL}/usuario/carrito/eliminar`).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getShoppingCart();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio para procesar la compra
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función processSale del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      const body = {
        ID_Tipo_Envio_FK: this.registerForm.get('tipo_envio')?.value,
        ID_Metodo_Pago_FK: this.registerForm.get('metodo_pago')?.value
      };

      if (this.registerForm.valid) {
        this.loading = true;
        this.shoppingCartService.processSale(`${apiURL}/usuario/carrito/procesar`, body).subscribe({
          next: (data: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
            this.loading = false;
            this.getShoppingCart();
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        })
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Campos vacíos", "Por favor completa la información de envío.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  decreaseQuantity(item: any) {
    if (item.Cantidad_Producto > 1) {
      item.Cantidad_Producto--;
      item.Subtotal_Venta = (item.Cantidad_Producto * item.Precio_Unitario).toFixed(2);
    }
  }

  increaseQuantity(item: any) {
    item.Cantidad_Producto++;
    item.Subtotal_Venta = (item.Cantidad_Producto * item.Precio_Unitario).toFixed(2);
  }
}
