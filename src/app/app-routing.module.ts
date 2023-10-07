import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthUserGuardService } from './auth/services/auth-user-guard.service';
import { AuthGuardService } from './auth/services/auth-guard.service';

const routes: Routes = [

  // Validar cualquier otro path y redireccionar a inicio
  { path: '', redirectTo: '', pathMatch: 'full' },

  //Rutas para el cliente
  {
    path: '',
    loadChildren: () =>
      import('./user/user-home/user-home.module').then((m) => m.UserHomeModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./user/user-profile/user-profile.module').then((m) => m.UserProfileModule),
    canActivate: [AuthUserGuardService]
  },
  {
    path: '',
    loadChildren: () =>
      import('./user/shopping-cart/shopping-cart.module').then((m) => m.ShoppingCartModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./user/products/products.module').then((m) => m.ProductsModule),
  },

  //Rutas para registrarse
  { //Para el cliente
    path: '',
    loadChildren: () =>
      import('./user/user-register/user-register.module').then((m) => m.UserRegisterModule),
  },

  //Rutas para el login
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },

  //Rutas para el admin/superadmin
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-home/admin-home.module').then((m) => m.AdminHomeModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/customer-management/customer-management.module').then((m) => m.CustomerManagementModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-profile/admin-profile.module').then((m) => m.AdminProfileModule),
    canActivate: [AuthGuardService]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
