import { Component, OnInit } from '@angular/core';
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
  shoppingDetailCart: any = {};
  customer: getCustomer = {} as getCustomer;
  noneProducts: boolean = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private userService: UserServicesService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.getShoppingCart();
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
          this.getProfile();
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
