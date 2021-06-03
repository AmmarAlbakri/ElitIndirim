import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  constructor(private api: ApiService) { }

  getWishList(pageNum) {
    return this.api.get(`/favourite?page=${pageNum}`);
  }

  addToWishList(data) {
    return this.api.post('/favourite/', data);
  }

  removeFromWishList(productID) {
    return this.api.delete(`/favourite/${productID}`);
  }
}
