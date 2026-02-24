import { Routes } from '@angular/router';
import { HomeComponent } from './features/ecommerce/home/home.component';
import { ProductsComponent } from './features/ecommerce/products/products.component';
import { ProductDetailComponent } from './features/ecommerce/product-detail/product-detail.component';
import { RegisterComponent } from './features/ecommerce/register/register.component';
import { LoginComponent } from './features/ecommerce/login/login.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users.component';
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'login', component: AdminLoginComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
