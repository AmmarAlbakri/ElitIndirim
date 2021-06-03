import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.page.html',
  styleUrls: ['./returns.page.scss'],
})
export class ReturnsPage implements OnInit {

  orders: any;
  pageNum = 1;
  noItem = false;
  public isDownloadComplete = false;


  constructor(private router: Router, private orderService: OrderService, private loading: LoadingService,
    private events: Events) { }

  ngOnInit() {
    this.getOrders();
  }


  getOrders() {
    this.orderService.getMyReturnRequests(this.pageNum)
      .subscribe((data) => {
        console.log(data);
        this.orders = data.data;
        if (data.data.length <= 0) {
          this.noItem = true;
        } else {
          this.noItem = false;
          if (data.data.length == this.orders.length) {
            this.isDownloadComplete = true;
          } else {
            this.isDownloadComplete = false;
          }
        }
      }, (err) => {
        this.events.publish("Request:Error", err);
      });
  }

  goToPage(page) {
    this.router.navigate([page]);
  }

  openOrder(order) {
    // console.log(order);
    const navigationExtras: NavigationExtras = {
      state: {
        order: order
      }
    };
    this.router.navigate(['tabs/profile/return-details'], navigationExtras);
  }

  loadData(infiniteScrollEvent) {
    this.pageNum += 1;
    this.orderService.getMyReturnRequests(this.pageNum)
      .subscribe((data) => {
        console.log(data);
        this.orders = data.data;
        if (data.data.length == this.orders.length) {
          this.isDownloadComplete = true;
        } else {
          this.isDownloadComplete = false;
        }
      }, (err) => {
        this.events.publish("Request:Error", err);
        setTimeout(() => {
          infiniteScrollEvent.target.complete();
        }, 5000);
      });
  }

}
