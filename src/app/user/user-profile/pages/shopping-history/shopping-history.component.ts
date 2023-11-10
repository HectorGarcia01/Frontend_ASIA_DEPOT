import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { ShoppingHistory, ShoppingDetail } from 'src/app/user/interfaces/shopping.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-shopping-history',
  templateUrl: './shopping-history.component.html',
  styleUrls: ['./shopping-history.component.css']
})
export class ShoppingHistoryComponent implements OnInit {
  // shoppingHistory: ShoppingHistory[] = [];
  // shoppingDetail: ShoppingDetail[] = [];
  shoppingHistory: any = {};
  countProducts: any = [];
  noneProducts: boolean = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.getShoppingHistory();
  }

  /**
   * Función para consumir servicio para ver el historial de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getShoppingCart del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getShoppingHistory() {
    try {
      this.shoppingCartService.getShoppingHistory(`${apiURL}/usuario/historial/compras`).subscribe({
        next: (data: any) => {
          this.shoppingHistory = data.shoppingHistory;
          this.countProducts = data.countProducts;
          this.shoppingHistory.forEach((detail: any) => {
            if (detail.createdAt) {
              const createdDate = detail.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              detail.createdAt = newDateCreate;
            }
          });
          this.noneProducts = true;
        },
        error: (error: any) => {
          this.noneProducts = false;
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio para cancerlar una compra pendiente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función cancelCustomerSaleId del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  cancelSale(id: number) {
    try {
      this.shoppingCartService.cancelCustomerSaleId(`${apiURL}/usuario/compra/cancelar`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getShoppingHistory();
        },
        error: (error: any) => {
          this.noneProducts = false;
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
