import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/user/services/category.service';
import { Category, Categories } from 'src/app/user/interfaces/category.interface';

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

  getCategories() {
    this.categoryService.getCategories('http://localhost:3000/usuario/ver/categorias').subscribe((data: any) => {
      this.category = data.categories;
    });
  }
}
