import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/user/services/category.service';
import { Category, Categories } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  category: Category[] = [];
  categories: Categories[] = [];
  categoriesPerColumn!: number;

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  /**
   * Función para consumir el servicio de de listar categorías
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories del servicio de categoría (category.service)
   */

  getCategories() {
    this.categoryService.getCategories(`${apiURL}/usuario/ver/categorias`).subscribe((data: any) => {
      this.category = data.categories;
      this.categoriesPerColumn = Math.ceil(this.category.length / 3);
    });
  }
}
