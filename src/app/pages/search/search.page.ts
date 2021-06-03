import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, Events, Platform, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FilterModelPage } from '../filter-model/filter-model.page';
import { ProductsService } from 'src/app/services/products/products.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { WishListService } from 'src/app/services/wishList/wish-list.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  products: any;

  totalProducts;
  timeLeft = "2 gün 18:20";
  adHidden = false;

  options = [];

  filter = {
    searchWord: '',
    category: '', // For ID
    categoryName: '', // For Name
    brand: '', // For ID
    brandName: '', // For Name
    vendor: '',
    filterByPriceRange: false,
    priceFrom: 1,
    priceTo: 100000,
    orderByPrice: false,
    orderByPriceFromHeight: false,
    options: []
  };

  discountPercent = undefined;

  hasFilter = false;

  public isDownloadComplete = false;
  public pageNum = 1;

  subscription;
  private backButtonPressed = false;


  constructor(private router: Router, private route: ActivatedRoute,
    private alertController: AlertController, private trasnlate: TranslateService, private activatedRoute: ActivatedRoute,
    private modalController: ModalController, private productsService: ProductsService,
    private loading: LoadingService, public events: Events, private wishlistService: WishListService,
    private globals: GlobalsService, private toast: ToastService, private platform: Platform, private navCtrl: NavController,
  ) {

  }

  ngOnInit() {
    this.init();

  }

  ionViewWillEnter() {

  }

  init() {
    this.pageNum = 1;
    this.isDownloadComplete = false;
    this.filter = {
      searchWord: '',
      category: '', //for Category ID
      categoryName: '', //for Category Name
      brand: '',
      brandName: '',
      vendor: '',
      filterByPriceRange: false,
      priceFrom: 1,
      priceTo: 100000,
      orderByPrice: false,
      orderByPriceFromHeight: false,
      options: []
    };
    this.options = [];
    console.log("init");

    this.filter.searchWord = this.activatedRoute.snapshot.params['input'];
    this.filter.category = this.activatedRoute.snapshot.params['catId'];
    this.filter.brand = this.activatedRoute.snapshot.params['brandId'];
    this.discountPercent = this.activatedRoute.snapshot.params['discountPercent'];
    console.log(this.filter);
    console.log(this.discountPercent);

    // this.isFilter();

    if (this.discountPercent == null || this.discountPercent == undefined || this.filter.searchWord != undefined) {
      console.log("get products");
      this.discountPercent = undefined;
      this.getProducts();
    } else {
      console.log("get products with dis");
      this.getProductsWithDiscount();
    }
  }

  getProducts() {
    // this.loading.presentLoading();
    let filterToSend = _.clone(this.filter);
    console.log('f1: ', filterToSend);
    delete filterToSend.categoryName;
    delete filterToSend.brandName;
    console.log('f2: ', filterToSend);
    this.productsService.searchForProducts(filterToSend, this.pageNum)
      .subscribe(data => {
        console.log("data without dis:", data);

        this.products = data.data;
        this.options = data.options;
        this.totalProducts = data.paging.total;
        this.pageNum = 1;
        this.isDownloadComplete = false;
        if (this.products.length == data['paging'].total) {
          this.isDownloadComplete = true;
        }
        // this.loading.loading.dismiss();
      }, err => {
        console.log(err);
        // this.loading.loading.dismiss();
        this.events.publish("Request:Error", err);
      });
  }

  getProductsWithDiscount() {
    this.productsService.searchWithDiscountPercent(this.pageNum, this.filter.category,
      this.discountPercent == 1 ? 1 : this.discountPercent - 9, this.discountPercent)
      .subscribe(data => {
        console.log("data with dis for category:", this.filter.category, " are:", data);
        this.products = data.data;
        this.options = data.options;
        this.totalProducts = data.paging.total;
        this.pageNum = 1;
        this.isDownloadComplete = false;
        if (this.products.length == data['paging'].total) {
          this.isDownloadComplete = true;
        }
      }, err => {
        console.log(err);
        this.events.publish("Request:Error", err);
      });
  }

  openProduct(product) {
    this.router.navigate(['tabs/home/product-detail', { productId: product._id }]);
  }


  favorite(product) {
    if (!product.isInWishList) {
      if (this.globals.isLoggedIn) {
        this.loading.presentLoading();
        const body = {
          product: product._id
        };
        this.wishlistService.addToWishList(body)
          .subscribe(data => {
            product.isInWishList = !product.isInWishList;
            this.loading.loading.dismiss();
          }, err => {
            this.events.publish("Request:Error", err);
            this.loading.loading.dismiss();
          });
      } else {
        this.toast.presentToast('warning', this.trasnlate.instant("please_login_first"), 1500);
      }
    } else {
      this.loading.presentLoading();
      this.wishlistService.removeFromWishList(product._id)
        .subscribe(data => {
          product.isInWishList = !product.isInWishList;
          this.loading.loading.dismiss();
        }, err => {
          this.events.publish("Request:Error", err);
          this.loading.loading.dismiss();
        });
    }
  }

  goToPage(page) {
    this.router.navigate([page]);
  }

  openFilter() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: FilterModelPage,
      componentProps: {
        options: this.options,
        filter: this.filter
      }
    });
    modal.onDidDismiss().then(data => {
      console.log(data);
      if (data.data != undefined && data.data != null) {

        this.loading.presentLoading();
        this.pageNum = 1;
        console.log('catData: ', data);

        // this.filter = {
        //   searchWord: data.data.searchKeyword,
        //   category: data.data.categoryId,
        //   categoryName: data.data.categoryId,
        //   brand: data.data.brandId,
        //   brandName: data.data.brandName,
        //   vendor: '',
        //   filterByPriceRange: data.data.filterByPriceRange,
        //   priceFrom: +data.data.minPrice,
        //   priceTo: +data.data.maxPrice,
        //   orderByPrice: false,
        //   orderByPriceFromHeight: false,
        //   options: data.data.options
        // };
        this.filter = {
          searchWord: data.data.searchWord,
          category: data.data.category,
          categoryName: data.data.categoryName,
          brand: data.data.brand,
          brandName: data.data.brandName,
          vendor: '',
          filterByPriceRange: data.data.filterByPriceRange,
          priceFrom: +data.data.priceFrom,
          priceTo: +data.data.priceTo,
          orderByPrice: false,
          orderByPriceFromHeight: false,
          options: data.data.options
        };

        let filterToSend = _.clone(this.filter);
        console.log('f1: ', filterToSend);
        delete filterToSend.categoryName;
        delete filterToSend.brandName;
        console.log('f2: ', filterToSend);
        this.productsService.searchForProducts(filterToSend, this.pageNum)
          .subscribe(data => {
            console.log(data);
            this.products = data.data;
            this.totalProducts = data.paging.total;
            this.isDownloadComplete = false;
            if (this.products.length == data['paging'].total) {
              this.isDownloadComplete = true;
            }
            this.loading.loading.dismiss();
          }, err => {
            this.events.publish("Request:Error", err);
            this.loading.loading.dismiss();
          });
      } // End Of IF
    });

    return await modal.present();
  }

  openSort() {
    console.log("sort");
    this.presentAlertRadio();
  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: this.trasnlate.instant("choose_sort_type"),
      inputs: [
        {
          name: "price up",
          type: "radio",
          label: this.trasnlate.instant("price_incremental"),
          value: "radio1"
        },
        {
          name: "price down",
          type: "radio",
          label: this.trasnlate.instant("price_decremental"),
          value: "radio2"
        },
        {
          name: "new first",
          type: "radio",
          label: this.trasnlate.instant("newest"),
          value: "radio3"
        },
        {
          name: "discount up",
          type: "radio",
          label: this.trasnlate.instant("discount_incremental"),
          value: "radio4"
        },
        {
          name: "discount down",
          type: "radio",
          label: this.trasnlate.instant("discount_decremental"),
          value: "radio5"
        },
        {
          name: "most sold",
          type: "radio",
          label: this.trasnlate.instant("most_sold"),
          value: "radio6"
        }
      ],
      buttons: [
        {
          text: this.trasnlate.instant("cancel"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.trasnlate.instant("ok"),
          handler: (data) => {
            console.log(data);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();

  }


  loadData(infiniteScrollEvent) {
    console.log("dis percent:", this.discountPercent);

    this.pageNum += 1;
    if (this.discountPercent == null || this.discountPercent == undefined) {
      let filterToSend = _.clone(this.filter);
      console.log('f1: ', filterToSend);
      delete filterToSend.categoryName;
      delete filterToSend.brandName;
      console.log('f2: ', filterToSend);
      this.productsService.searchForProducts(filterToSend, this.pageNum)
        .subscribe((response) => {
          console.log("res in 1:", response);
          this.products = this.products.concat(response['data']);
          this.options = response.options;
          console.log(this.options);
          infiniteScrollEvent.target.complete();
          if (this.products.length == response['paging'].total) {
            this.isDownloadComplete = true;
          }
        }, (error) => {
          setTimeout(() => {
            infiniteScrollEvent.target.complete();
          }, 5000);
          this.events.publish('Request:Error', error);
        });
    } else {
      this.productsService.searchWithDiscountPercent(this.pageNum, this.filter.category, this.discountPercent - 9, this.discountPercent)
        .subscribe(data => {
          console.log("res in 2:", data);
          this.products = this.products.concat(data['data']);
          console.log(this.options);
          this.options = data.options;
          this.totalProducts = data.paging.total;
          this.isDownloadComplete = false;

          infiniteScrollEvent.target.complete();
          if (this.products.length == data['paging'].total) {
            this.isDownloadComplete = true;
          }
        }, err => {
          console.log(err);
          this.events.publish("Request:Error", err);
        });
    }

  }

  ionViewDidEnter() {
    // this.backButtonPressed = false;
    // this.subscription = this.platform.backButton.subscribe(() => {
    //   // this.navCtrl.back();
    // });
  }

  ionViewWillLeave() {
    // this.subscription.unsubscribe();
    // this.backButtonPressed = false;
  }
}
