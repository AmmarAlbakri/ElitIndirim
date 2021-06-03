import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { ToastService } from '../toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../api/api.service';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  public isLoggedIn = false;
  public name = this.translate.instant('guest');
  public shareBaseURL = this.api.shareBaseURL;
  public EMAIL_REGEXP = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}';
  public NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
  public products = [];

  public cartCount = 0;
  public activeTab = 'home';
  constructor(public events: Events,
    public toast: ToastService,
    public translate: TranslateService,
    private api: ApiService) {
    this.products = JSON.parse(localStorage.getItem('products'));
    if (this.products == null || this.products == undefined) {
      this.products = [];
    }

    this.events.subscribe('offlineCart:change', (product, selectedOption, isAdd) => {
      console.log("in globals :", product);

      const checkProduct = this.products.find(e => e.product == product._id);
      if (checkProduct == null ||
        checkProduct == undefined) {
        console.log("didnt find product");

        let body;
        if (selectedOption != null || selectedOption != undefined) {
          console.log("in if");

          body = {
            product: product._id,
            quantity: 1,
            selectedOption: selectedOption._id
          };
        } else {
          console.log("in else");

          body = {
            product: product._id,
            quantity: 1,
            selectedOption: null
          };
        }
        this.products.push(body);
      }
      else {
        this.products.map(e => {
          if (e.product == product._id) {
            if (isAdd) {
              e.quantity += 1;
            }
            else {
              e.quantity = product.quantity;
            }
          }
        });
      }
      localStorage.setItem('products', JSON.stringify(this.products));
      if (isAdd) {
        this.toast.presentToast('success', this.translate.instant('added_to_cart_successfuly'), 1500);
      }
    });

    this.events.subscribe('offlineCart:remove', (productID, isClear = false) => {
      console.log(productID);
      if (!isClear) {
        this.products = this.products.filter(e => e.product != productID);
        localStorage.setItem('products', JSON.stringify(this.products));
      }
      else {
        this.products = [];
        localStorage.removeItem('products');
      }
    });
  }

  getActiveTab() {
    switch (this.activeTab) {
      // case 'home':
      //   return 'home';
      case 'cart':
        return 'cart';
      case 'favorite':
        return 'favorite';
      case 'profile':
        return 'profile';
      default:
        return 'home';
    }
  }

  setActiveTab(tabName) {
    if (!isNullOrUndefined(tabName) && tabName != '') {
      this.activeTab = tabName;
    }
    else {
      this.activeTab = 'home';
    }
    console.log('setActiveTab: ', this.activeTab);
  }
  // calcDiscount(newPrice, oldPrice) {
  //   return Math.round(Number(((oldPrice - newPrice) / (oldPrice)) * 100));
  // }
}
