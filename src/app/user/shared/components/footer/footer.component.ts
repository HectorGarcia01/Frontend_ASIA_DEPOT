import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/user/services/category.service';
import { Category, Categories } from 'src/app/user/interfaces/category.interface';

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

  getCategories() {
    this.categoryService.getCategories('http://localhost:3000/usuario/ver/categorias').subscribe((data: any) => {
      this.category = data.categories;
      this.categoriesPerColumn = Math.ceil(this.category.length / 3);
    });
  }
}
