import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(public api: ApiService) { }

  getAllCategories() {
    return this.api.get('/category/user/getAllMainCategory');
  }

  getCategoryByID(categoryID) {
    return this.api.get(`/category/${categoryID}`);
  }

  getAllSubCategories() {
    return this.api.get('/subCategory');
  }

  // getSubCategoryByID(categoryID) {
  //   return this.api.get(`/subCategory/${categoryID}`);
  // }

  getSubCategoryProducts(categoryID) {
    return this.api.get(`/product/filterBySubCategory/${categoryID}`);
  }

  getAllBrands() {
    return this.api.get('/brand/homeScreen');
  }
}
