import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  shoppingDetailCart: any = {};

  constructor(
    private shoppingCartService: ShoppingCartService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.getShoppingCart();
  }

  getShoppingCart() {
    try {
      this.shoppingCartService.getShoppingCart(`${apiURL}/usuario/carrito/ver`).subscribe({
        next: (data: any) => {
          this.shoppingDetailCart = data.shoppingDetailCart;
          console.log(this.shoppingDetailCart);
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
