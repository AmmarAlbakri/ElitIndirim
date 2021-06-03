import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
// import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Address } from 'src/app/Model/address';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { Events } from '@ionic/angular';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.page.html',
  styleUrls: ['./order-confirm.page.scss'],
})
export class OrderConfirmPage implements OnInit {

  public addresses: [Address];
  public selectedShippingAddressID = '';
  public selectedPaymentAddressID = '';
  public isSameAddressForPayment = true;
  public addressChoosed = false;
  public isFirstStepFinished = false;
  public totals;
  public contracts;
  public payLink = '';
  private paymentToken = '';
  public agreedToContracts = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private userService: UserService,
    private events: Events,
    private globals: GlobalsService,
    private orderService: OrderService,
    private toastService: ToastService,
    private translate: TranslateService,
    private iab: InAppBrowser,
    private cartService: CartService) {

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    console.log('didEnter');
    this.getAddresses();
  }

  getAddresses() {
    this.loading.presentLoading();
    this.userService.getAddresses()
      .subscribe((response) => {
        this.addresses = response.data;
        this.loading.dismiss();
      }, (error) => {
        this.events.publish('Request:Error', error);
        console.log('error get addresses', error);
        this.loading.dismiss();
      });
  }

  addNewAddress() {
    this.selectedPaymentAddressID = '';
    this.selectedShippingAddressID = '';
    this.router.navigate(['tabs/cart/add-address']);
  }

  setShippingAddress(address) {
    this.selectedShippingAddressID = address._id;
    console.log('selectedShippingAddressID: ', this.selectedShippingAddressID);
    if (this.isSameAddressForPayment) {
      this.selectedPaymentAddressID = address._id;
    }
    this.checkSelectedAddressesInfo();
  }

  sameAddressChecked() {
    this.isSameAddressForPayment = !this.isSameAddressForPayment;
    if (this.isSameAddressForPayment) {
      this.selectedPaymentAddressID = this.selectedShippingAddressID;
    }
    else {
      this.selectedPaymentAddressID = '';
    }
    this.checkSelectedAddressesInfo();
  }

  setPaymentAddress(address) {
    this.selectedPaymentAddressID = address._id;
    console.log('selectedPaymentAddressID: ', this.selectedPaymentAddressID);

    this.checkSelectedAddressesInfo();
  }

  checkSelectedAddressesInfo() {
    if (this.selectedPaymentAddressID != '' &&
      this.selectedShippingAddressID != '') {
      this.addressChoosed = true;
    }
    else {
      this.addressChoosed = false;
    }
  }

  confirmAddresses() {
    this.loading.presentLoading();
    const selectedAddresses = {
      paymentAddress: this.selectedPaymentAddressID,
      shippingAddress: this.selectedShippingAddressID
    };
    this.orderService.saveInvoiceAddresses(selectedAddresses)
      .subscribe((response) => {
        this.getBillTotalsAndPayLink();
      }, (error) => {
        this.loading.loading.dismiss();
      });
  }

  getBillTotalsAndPayLink() {
    this.orderService.getBillTotalsAndPayLink()
      .subscribe((response) => {
        this.totals = response.data.totals;
        this.contracts = response.data.contracts;
        console.log('conts: ', this.contracts);

        this.payLink = response.data.paymentPageUrl;
        this.paymentToken = this.getTokenFromURL(this.payLink);
        console.log('token= ', this.paymentToken);
        this.isFirstStepFinished = true;
        this.loading.loading.dismiss();
      }, (error) => {
        this.loading.loading.dismiss();
      });
  }

  editSelectedAddresses() {
    this.addressChoosed = false;
    this.isFirstStepFinished = false;
    this.totals = undefined;
    this.contracts = undefined;
    this.payLink = '';
    this.paymentToken = '';
    this.agreedToContracts = false;
  }

  agreeToContractsClicked() {
    this.agreedToContracts = !this.agreedToContracts;
  }

  getTokenFromURL(urlString) {
    const url = new URL(urlString);
    return url.searchParams.get('token');
  }

  goToPage(pageName, contractType = '') {

    const navigationExtras: NavigationExtras = {
      state: {
        contracts: this.contracts,
        contractType
      }
    };
    this.router.navigate(['tabs/cart/' + pageName], navigationExtras);
  }

  pay() {
    if (this.globals.isLoggedIn) {
      if (this.agreedToContracts) {
        const browser = this.iab.create(this.payLink, '_blank', 'hideurlbar=yes,location=yes,zoom=yes');

        browser.on('loadstart')
          .subscribe((response) => {
            if (response['url'].indexOf('success=true') != -1) {
              console.log('First');

              browser.close();
              this.checkPaymentResult();
            }
            else if (response['url'].indexOf('success=false') != -1) {
              console.log('failed');

              browser.close();
              this.checkPaymentResult();
            }
          });

        // browser.on('loadstop')
        //   .subscribe((response) => {
        //     if (response['url'].indexOf('success=true') != -1) {
        //       console.log('Second');
        //       browser.close();
        //       this.checkPaymentResult();
        //     }
        //   });

        browser.on('exit')
          .subscribe((response) => {
            console.log('Third: ', response);
            browser.close();
            // this.checkPaymentResult();
          });
      }
      else {
        this.toastService.presentToast('warning', this.translate.instant('you_must_agree_to_contracts'));
      }
    }
    else {
      this.toastService.presentToast('warning', this.translate.instant('please_login_first'));
      this.router.navigate(['login']);
    }

  }

  getCartItems() {
    this.cartService.getCartItems()
      .subscribe((response) => {
        if (Object.keys(response['data'].cart).length <= 0) {
          this.globals.cartCount = 0;
        }
        else {
          this.globals.cartCount = Object.keys(response['data'].cart).length;
        }
      }, (error) => {
        console.log('error get cart items', error);
      });
  }

  checkPaymentResult() {
    this.loading.presentLoading();
    this.orderService.checkPaymentResult(this.paymentToken)
      .subscribe((response) => {
        console.log('paymentResp: ', response);
        if (response.status == true) {
          console.log('status: ', response.status);
          this.getCartItems();
          this.loading.loading.dismiss();
          this.toastService.presentToast('success', this.translate.instant('pay_done_successfully'), 3000);
        }
        else {
          console.log('status: ', response.status);
          this.loading.loading.dismiss();
          this.toastService.presentToast('danger', this.translate.instant('pay_done_error'), 3000);
        }

        this.router.navigate(['tabs/home'], { replaceUrl: true });
      }, (error) => {
        this.loading.loading.dismiss();
      });
  }
}
