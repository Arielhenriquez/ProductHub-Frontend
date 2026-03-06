import { Routes } from '@angular/router';
import { RegisterComponent } from './features/ecommerce/register/register.component';
import { LoginComponent } from './features/ecommerce/login/login.component';
import { ForgotPasswordComponent } from './features/ecommerce/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/ecommerce/reset-password/reset-password.component';
import { HomeComponent } from './features/ecommerce/home/home.component';
import { ProductsComponent } from './features/ecommerce/products/products.component';
import { ProductDetailComponent } from './features/ecommerce/product-detail/product-detail.component';
import { ForbiddenComponent } from './features/ecommerce/forbidden/forbidden.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [guestGuard] },
  { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [authGuard] },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'admin/login', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin/forgot-password', redirectTo: '/forgot-password', pathMatch: 'full' },
  { path: 'admin/reset-password', redirectTo: '/reset-password', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'users', component: AdminUsersComponent, canActivate: [adminGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
