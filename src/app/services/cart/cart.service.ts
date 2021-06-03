import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private api: ApiService) { }

  getCartItems() {
    return this.api.get('/cart');
  }

  addToCart(value) {
    return this.api.post('/cart', value);
  }

  editCartItem(productID, quantity) {
    return this.api.put(`/cart/${productID}`, { quantity: quantity });
  }

  removeCartItem(productID) {
    return this.api.delete(`/cart/${productID}`);
  }

  getOfflineCartItems(products) {
    return this.api.post('/cart/getDataWithoutLogin', products);
  }

  syncOfflineCart(products) {
    const data = {
      products: products
    };
    return this.api.post('/cart/syncCart', data);
  }

  addAdditionalService(cardId, note) {
    const data = {
      sendAddtionalService: true,
      addtionalData: note
    };
    return this.api.post(`/cart/addAddtionsalService/${cardId}`, data);
  }

  removeAdditionalService(cardId) {
    const data = {
      sendAddtionalService: false,
      addtionalData: ''
    };
    return this.api.post(`/cart/addAddtionsalService/${cardId}`, data);
  }
}
