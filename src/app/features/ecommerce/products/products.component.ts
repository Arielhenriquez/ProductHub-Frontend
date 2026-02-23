import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreHeaderComponent } from '../../../components/store-header/store-header.component';
import { StoreFooterComponent } from '../../../components/store-footer/store-footer.component';
import { ProductGridComponent } from '../../../components/product-grid/product-grid.component';
import { ProductFiltersComponent } from '../../../components/product-filters/product-filters.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    StoreHeaderComponent,
    StoreFooterComponent,
    ProductGridComponent,
    ProductFiltersComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {}
