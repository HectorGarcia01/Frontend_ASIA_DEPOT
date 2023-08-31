import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // Validar cualquier otro path y redireccionar a inicio
  { path: '', redirectTo: '', pathMatch: 'full' },

  //Rutas para el login

  //Rutas para
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-home/admin-home.module').then((m) => m.AdminHomeModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/customer-management/customer-management.module').then((m) => m.CustomerManagementModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-profile/admin-profile.module').then((m) => m.AdminProfileModule),
  },
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
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
