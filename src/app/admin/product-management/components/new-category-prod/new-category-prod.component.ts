import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-category-prod',
  templateUrl: './new-category-prod.component.html',
  styleUrls: ['./new-category-prod.component.css']
})
export class NewCategoryProdComponent {
  @Output() closeCategoryModal = new EventEmitter<void>();
  @Output() saveCategory = new EventEmitter<string>();

  newCategory: string = '';

  close() {
    this.closeCategoryModal.emit();
  }

  save() {
    this.saveCategory.emit(this.newCategory);
  }
}