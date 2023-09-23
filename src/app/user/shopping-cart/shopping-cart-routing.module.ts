import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingComponent } from './pages/shopping/shopping.component';

const routes: Routes = [
  { path: '', redirectTo: 'checkout/cart', pathMatch: 'full' },

  {
    path: 'checkout/cart',
    component: ShoppingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule { }
