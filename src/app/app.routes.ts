import { Routes } from '@angular/router';
import { HomeComponent } from './features/ecommerce/home/home.component';
import { ProductsComponent } from './features/ecommerce/products/products.component';
import { ProductDetailComponent } from './features/ecommerce/product-detail/product-detail.component';
import { RegisterComponent } from './features/ecommerce/register/register.component';
import { LoginComponent } from './features/ecommerce/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
