import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Events, Platform } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage implements OnInit {


  piece: any;
  products: any;
  total;

  noItems = false;

  // back
  subscription;
  public backButtonPressed = false;

  constructor(private router: Router, private http: HttpClient, private toastService: ToastService,
    private translate: TranslateService, private cartService: CartService, public events: Events, private loading: LoadingService,
    private globals: GlobalsService, private platform: Platform
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log("ionVireDidEnter");
    this.globals.setActiveTab('cart');
    this.checkCart();
    this.backButtonPressed = false;
    this.subscription = this.platform.backButton.subscribe(() => {
      this.router.navigate(['tabs/home']);
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.backButtonPressed = false;
  }

  checkCart() {
    if (this.globals.isLoggedIn) {
      this.getProducts();
    } else {
      if (this.globals.products != null &&
        this.globals.products != undefined &&
        this.globals.products.length > 0) {
        this.getOfflineCartItems();
      } else {
        this.noItems = true;
        this.products = [];
      }
    }
  }


  getProducts() {
    // this.loading.presentLoading();
    this.cartService.getCartItems()
      .subscribe(data => {
        console.log(data);
        this.products = data.data.products;
        this.total = data.data.totals;
        if (data.data.products.length <= 0) {
          this.noItems = true;
        } else {
          this.noItems = false;
        }
        console.log("noItems:", this.noItems);

        // this.loading.loading.dismiss();
      }, err => {
        this.events.publish('Request:Error', err);
        // this.loading.loading.dismiss();
      });
  }

  getOfflineCartItems() {
    if (this.globals.products == [] || this.globals.products == null || this.globals.products == undefined) {
      this.noItems = true;
    } else {
      console.log("getting offline cart");
      const products = {
        products: this.globals.products
      };
      console.log("product from offline cart:", products);

      this.cartService.getOfflineCartItems(products)
        .subscribe((response) => {
          console.log(response);
          this.products = response.data.products;
          this.total = response.data.totals;
          if (response.data.products.length <= 0) {
            this.noItems = true;
          } else {
            this.noItems = false;
          }
        }, (error) => {
          this.events.publish('Request:Error', error);
          console.log('error get offline cart ', error);
        });
    }
  }

  sendOrder() {
    if (this.globals.isLoggedIn) {
      this.router.navigate(['tabs/cart/order-confirm']);
    } else {
      const message = this.translate.instant('please_login_first');
      this.toastService.presentToast('warning', message);
      this.router.navigate(['login']);
    }
  }



  goToPage(page) {
    this.router.navigate([page]);

  }

  openProduct(product) {
    this.router.navigate(['tabs/cart/product-detail', { productId: product.productId }]);
  }

  quntityChange(product) {
    this.updateCartItem(product);
  }

  updateCartItem(product) {
    console.log(product);
    if (this.globals.isLoggedIn) {
      // this.loading.presentLoading();
      let body;
      if (product.selectedOption == null || product.selectedOption == undefined) {
        body = {
          "product": product.productId,
          "quantity": product.quantity,
        };
      } else {
        body = {
          "product": product.productId,
          "quantity": product.quantity,
          "selectedOption": product.selectedOption._id
        };
      }
      this.cartService.addToCart(body)
        .subscribe((response) => {
          console.log(response);
          this.refresh();
          // this.loading.dismiss();
        }, (error) => {
          // this.loading.dismiss();
          this.events.publish('Request:Error', error);
        });
    } else {
      this.events.publish('offlineCart:change', product, false);
      this.getOfflineCartItems();
    }
  }

  deleteProduct(product) {
    // this.loading.presentLoading();
    if (this.globals.isLoggedIn) {

      this.cartService.removeCartItem(product.productId)
        .subscribe(data => {
          this.refresh();
          console.log(data);

          // this.loading.loading.dismiss();
        }, err => {
          this.events.publish("Request:Error", err);
          // this.loading.loading.dismiss();
        });
    } else {
      this.events.publish('offlineCart:remove', product._id, false);
      this.refresh();
    }
  }

  refresh() {
    this.checkCart();
  }
}

