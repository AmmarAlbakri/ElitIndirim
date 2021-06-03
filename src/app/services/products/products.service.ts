import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private api: ApiService) { }

  getMostVisited() {
    return this.api.get(`/product/mostVisited`);
  }

  getProductDetails(productID) {
    return this.api.get(`/product/user/product/details/${productID}`);
  }

  getRelatedProducts(subCatID) {
    return this.api.get(`/product/user/GetAllProductsForCategory/${subCatID}`);
  }

  getMostPurchased() {
    return this.api.get(`/product/mostVisited`);
  }

  getLatestProducts() {
    return this.api.get(`/product/productsForUser?page=1`);
  }

  searchForProducts(filter, pageNum) {
    return this.api.post(`/product/user/AdvanceSearch?page=${pageNum}`, filter);
  }

  searchWithDiscountPercent(pageNum,catID,min,max){
    return this.api.get(`/product/user/GetDiscountRange?page=${pageNum}&category=${catID}&min=${min}&max=${max}`);

  }
}
