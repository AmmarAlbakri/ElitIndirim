import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Events } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.page.html',
  styleUrls: ['./order-confirm.page.scss'],
})
export class OrderConfirmPage implements OnInit {

  stage = "address";

  noItems;
  pageNum = 1;

  addresses: any;
  isShippingSameDelivery = true;
  deliveryAddress: any;
  paymentAddress: any;
  isActive = false;
  constructor(private router: Router, private userService: UserService, private loading: LoadingService,
    private events: Events, private orderService: OrderService, private toast: ToastService, private translate: TranslateService) { }

  ngOnInit() {
  }

  // ionViewWillEnter() {
  //   this.getAddresses();
  // }

  ionViewDidEnter() {
    console.log('didEnter');
    this.getAddresses();
  }

  getAddresses() {
    this.loading.presentLoading();
    this.userService.getAddresses()
      .subscribe((response) => {
        console.log(response);
        this.addresses = response.data;
        this.loading.loading.dismiss();
        if (this.addresses.length < 1) {
          this.noItems = true;
        } else {
          this.noItems = false;
        }
      }, (error) => {
        this.loading.loading.dismiss();
        this.events.publish('Request:Error', error);
      });
  }

  setDeliveryAddress(address) {
    console.log(address);
    this.deliveryAddress = address;
    if (this.isShippingSameDelivery) {
      this.paymentAddress = this.deliveryAddress;
      this.isActive = true;
    }
    else {
      if (this.paymentAddress != undefined) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }
  setPaymentAddress(address) {
    console.log(address);
    this.paymentAddress = address;
    if (this.deliveryAddress != undefined) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  sameAddressCheck() {
    console.log("not same");
    this.isShippingSameDelivery = !this.isShippingSameDelivery;
    if (this.deliveryAddress != undefined) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  goToPage(page) {
    this.router.navigate([page]);
  }

  submit() {
    this.loading.presentLoading();
    let body;
    if (this.isShippingSameDelivery) {
      body = {
        "paymentAddress": this.paymentAddress._id,
        "shippingAddress": this.paymentAddress._id
      };
    } else {
      body = {
        "paymentAddress": this.paymentAddress._id,
        "shippingAddress": this.deliveryAddress._id
      };
    }
    this.orderService.sendOrder(body)
      .subscribe(data => {
        console.log(data);
        this.loading.loading.dismiss();
        this.toast.presentToast('success', this.translate.instant("order_sent_successfuly"));
        this.router.navigate(['tabs/home'], { replaceUrl: true });
      }, err => {
        this.loading.loading.dismiss();
        this.events.publish("Request:Error")
      });
  }
  // next(stage) {
  //   this.stage = stage;
  //   console.log("next step: ", stage);
  //   let body;
  //   if (this.isShippingSameDelivery) {
  //     body = {
  //       "paymentAddress": this.paymentAddress._id,
  //       "shippingAddress": this.paymentAddress._id
  //     };
  //   } else {
  //     body = {
  //       "paymentAddress": this.paymentAddress._id,
  //       "shippingAddress": this.deliveryAddress._id
  //     };
  //   }
  //   this.loading.presentLoading();
  //   this.orderService.sendOrder(body)
  //     .subscribe(data => {
  //       console.log(data);
  //       this.loading.loading.dismiss();
  //     }, err => {
  //       this.loading.loading.dismiss();
  //       this.events.publish("Request:Error")
  //     });
  // }
}
