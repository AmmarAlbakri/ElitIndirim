import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private api: ApiService) { }

  sendOrder(value) {
    return this.api.post('/order/user/orders/', value);
  }

  getMyOrders(pageNum) {
    return this.api.get(`/order/userOrders?page=${pageNum}`);
  }

  getMyReturnRequests(pageNum) {
    return this.api.get(`/refundRequest/user/requests?page=${pageNum}`);
  }

  sendRetunRequest(data) {
    return this.api.post('/refundRequest/user/requests', data);
  }
  uploadImage(data) {
    return this.api.post('/upload/images/', data);
  }

  //Payment
  getContracts(data) {
    return this.api.post('/order/getContracts1', data);
  }
  // saveInvoiceAddresses(data) {
  //   return this.api.post('/order/saveAddresses', data);
  // }
  // getBillTotalsAndPayLink() {
  //   return this.api.post('/order/getTotalsAndPayLink', {});
  // }
  // checkPaymentResult(paymentToken) {
  //   return this.api.get(`/order/callback?token=${paymentToken}`);
  // }

  //New
  saveInvoiceAddresses(data) {
    return this.api.post('/cart/SaveShipAndPayAddresses', data);
  }
  getBillTotalsAndPayLink() {
    return this.api.post('/cart/GetContractsAndPaylink', {});
  }
  checkPaymentResult(paymentToken) {
    return this.api.get(`/order/CheckPayToken?token=${paymentToken}`);
  }
}
