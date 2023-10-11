import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/user/services/product.service';
import { Product } from 'src/app/user/interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productoId!: string;
  product: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProductId();
  }

  getProductId() {
    // this.route.paramMap.subscribe(params => {
    //   this.productoId = params.get('id');
    // });

    this.productService.getProductId(`http://localhost:3000/usuario/ver/producto/${this.getProductId}`).subscribe((data: any) => {
      this.product = data.products;
    });
  }
}
