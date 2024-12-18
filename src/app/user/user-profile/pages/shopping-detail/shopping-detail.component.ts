import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { ProductService } from 'src/app/user/services/product.service';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-shopping-detail',
  templateUrl: './shopping-detail.component.html',
  styleUrls: ['./shopping-detail.component.css']
})
export class ShoppingDetailComponent implements OnInit {
  shoppingDetail: any = {};
  productImages: { [key: number]: string } = {};
  noneShoppingDetail: boolean = false;
  cancelShopping: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.scrollToTop();
    this.getParamsId();
  }

  /**
   * Función para obtener el id de los parámetros de la url
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId que consume el servicio del backend
   */

  getParamsId() {
    this.route.paramMap.subscribe(params => {
      const shoppingId = params.get('id');

      if (shoppingId) {
        this.getShoppingDetail(shoppingId);
      }
    });
  }

  /**
   * Función para consumir servicio para ver el detalle del carrito de compras
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función shoppingHistoryId del servicio de carrito de compras (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getShoppingDetail(id: any) {
    try {
      this.shoppingCartService.shoppingHistoryId(`${apiURL}/usuario/historial/compras`, id).subscribe({
        next: (data: any) => {
          this.shoppingDetail = data.shoppingDetail;
          this.shoppingDetail.Total_Factura = this.shoppingDetail.Total_Factura.toFixed(2);

          const createdDate = this.shoppingDetail.createdAt;
          const parts = createdDate.split('T');
          const newDateCreate = parts[0];
          this.shoppingDetail.createdAt = newDateCreate;

          if (this.shoppingDetail.estado.Tipo_Estado === 'Pendiente') {
            this.cancelShopping = true;
          } else {
            this.cancelShopping = false;
          }

          this.shoppingDetail.detalles_venta.forEach((producImage: any) => {
            this.getPhotos(producImage.producto.id);
          });
          
          this.noneShoppingDetail = true;
        },
        error: (error: any) => {
          this.noneShoppingDetail = false;
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver la imágen de cada producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProductPhoto del servicio de producto (product.service)   
   */

  getPhotos(id: any) {
    try {
      this.productService.getProductPhoto(`${apiURL}/usuario/ver/foto/producto`, id).subscribe({
        next: (data: Blob) => {
          this.productImages[id] = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.productImages[id] = 'assets/Logo_ASIA_DEPOT.png';
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio para cancerlar una compra pendiente
   * Fecha creación: 20/10/2023
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
          this.getParamsId();
        },
        error: (error: any) => {
          this.noneShoppingDetail = false;
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
