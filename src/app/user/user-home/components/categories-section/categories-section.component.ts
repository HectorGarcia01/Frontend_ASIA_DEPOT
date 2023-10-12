import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/user/services/category.service';
import { Category, Categories } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-categories-section',
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.css']
})
export class CategoriesSectionComponent implements OnInit {
  category: Category[] = [];
  categories: Categories[] = [];
  
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
    });
  }
}
