import { Component } from '@angular/core';
import { ProductService } from 'src/app/user/services/product.service';
import { Product, Products } from 'src/app/user/interfaces/product.interface';

@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.css']
})
export class ProductsSectionComponent {
  product: Product[] = [];
  prducts: Products[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts('http://localhost:3000/usuario/ver/productos').subscribe((data: any) => {
      this.product = data.products;
    });
  }
}
