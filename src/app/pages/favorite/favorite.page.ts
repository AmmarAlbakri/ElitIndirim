import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { WishListService } from 'src/app/services/wishList/wish-list.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Events, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {


  public isDownloadComplete = false;
  public pageNum = 1;


  products: any;
  noData = false;

  // back
  subscription;
  public backButtonPressed = false;

  constructor(private http: HttpClient, private router: Router, private wishlistService: WishListService, private translate: TranslateService,
    private globals: GlobalsService, private loading: LoadingService, private toast: ToastService, private events: Events, private platform: Platform) {
  }

  ionViewWillEnter() {
    if (this.globals.isLoggedIn) {
      console.log("ionViewWillEnter");
      this.noData = false;
      this.getProducts();
    } else {
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }

  ionViewDidEnter() {
    console.log("ionVireDidEnter");
    this.globals.setActiveTab('favorite');
    this.backButtonPressed = false;
    this.subscription = this.platform.backButton.subscribe(() => {
      this.router.navigate(['tabs/home'], { replaceUrl: true });
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.backButtonPressed = false;
  }

  ngOnInit() {
  }

  getProducts() {
    // this.loading.presentLoading();
    this.wishlistService.getWishList(this.pageNum)
      .subscribe(data => {
        console.log(data);
        this.pageNum = 1;
        this.products = data.data;
        this.isDownloadComplete = false;
        if (this.products.length == data['paging'].total) {
          this.isDownloadComplete = true;
        }
        if (this.products.length <= 0) {
          this.noData = true;
        }
        // this.loading.loading.dismiss();
      }, err => {
        this.events.publish("Request:Error", err);
        // this.loading.loading.dismiss();
      });
  }

  goToPage(page) {
    this.router.navigate([page]);
  }

  favorite(product) {
    // if (!product.isInWishList) {
    //   if (this.globals.isLoggedIn) {
    //     this.loading.presentLoading();
    //     const body = {
    //       product: product._id
    //     };
    //     this.wishlistService.addToWishList(body)
    //       .subscribe(data => {
    //         console.log(data);
    //         product.isInWishList = !product.isInWishList;
    //         this.loading.loading.dismiss();
    //       }, err => {
    //         this.events.publish("Request:Error", err);
    //         this.loading.loading.dismiss();
    //       });
    //   } else {
    //     this.toast.presentToast('warning', this.translate.instant("please_login_first"), 3000);
    //   }
    // } else {
    this.loading.presentLoading();
    this.wishlistService.removeFromWishList(product._id)
      .subscribe(data => {
        console.log(data);
        product.isInWishList = !product.isInWishList;
        // this.refresh();
        this.products = this.products.filter(a => a._id != product._id);
        this.loading.loading.dismiss();
      }, err => {
        this.events.publish("Request:Error", err);
        this.loading.loading.dismiss();
      });
    // }
  }

  refresh() {
    this.getProducts();
  }

  loadData(infiniteScrollEvent) {
    this.pageNum += 1;
    this.wishlistService.getWishList(this.pageNum)
      .subscribe((response) => {
        this.products = this.products.concat(response['data']);
        infiniteScrollEvent.target.complete();
        if (this.products.length == response['paging'].total) {
          this.isDownloadComplete = true;
        }
      }, (error) => {
        setTimeout(() => {
          infiniteScrollEvent.target.complete();
        }, 5000);
        this.events.publish('Request:Error', error);
        console.log('error search ', error);
      });
  }

  openProduct(product) {
    this.router.navigate(['tabs/favorite/product-detail', { productId: product._id }]);

    // this.router.navigate(['product-detail'], navExtras);
  }
}
