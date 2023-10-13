import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/user/services/category.service';
import { Category, CategoryResponse } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-categories-section',
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.css']
})
export class CategoriesSectionComponent implements OnInit {
  category: Category[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;

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
    this.categoryService.getCategories(`${apiURL}/usuario/ver/categorias/paginacion`, this.currentPage, this.pageSize)
      .subscribe((data: CategoryResponse) => {
        this.category = data.categories;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCategories();
    }
  }

  getPagesArray(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
}
