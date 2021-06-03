import { Component, OnInit, ViewChild, Renderer, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, Events, NavController } from '@ionic/angular';
import { ImageModelPage } from '../image-model/image-model.page';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { WishListService } from 'src/app/services/wishList/wish-list.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  adHidden = false;


  productId;
  catId;

  optionImages;
  productOptions = [];
  selectedOption;
  notEnoughQnt = false;
  optionError = false;

  // options = {
  //   message: 'share this', // not supported on some apps (Facebook, Instagram)
  //   subject: '', // fi. for email
  //   files: ['', ''], // an array of filenames either locally or remotely
  //   url: 'https://www.website.com/foo/#bar?a=b',
  //   chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title,
  // };


  sliderOpts = {
    zoom: false,
    spaceBetween: 20,
    slidesPerView: 1,
    centeredSlides: true,
    // spaceBetween: 20,
  };

  products: any;
  noRelated = true;

  product: any;

  constructor(private toast: ToastService,
    private translate: TranslateService,
    private navCtrl: NavController,
    public socialSharing: SocialSharing,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    public events: Events,
    private loading: LoadingService,
    private cartService: CartService,
    public globals: GlobalsService,
    private wishlistService: WishListService) {
  }


  toggled1 = false;
  toggled2 = false;


  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
    console.log(this.productId);

    if (this.productId != null && this.productId != undefined) {
      this.getProduct(this.productId);
    }
  }


  getProduct(id) {
    this.loading.presentLoading();
    this.productService.getProductDetails(id)
      .subscribe(data => {
        console.log(data);
        this.product = data.data;
        this.catId = data.data.category._id;
        this.optionImages = this.product.options.map(a => a.images);
        this.optionImages = this.optionImages.filter(value => Object.keys(value).length !== 0);
        console.log("option images:", this.optionImages);
        this.getSimilarProducts();
      }, err => {
        console.log(err);
        this.loading.loading.dismiss();
        this.events.publish("Request:Error", err);
      });

  }

  getSimilarProducts() {
    console.log(this.catId);
    this.productService.getRelatedProducts(this.catId)
      .subscribe(products => {
        console.log(products);
        this.products = products.data.filter(item => item._id != this.productId);
        if (this.products.length == 0) {
          this.noRelated = true;
        } else {
          this.noRelated = false;
        }

        this.loading.loading.dismiss();
      }, err => {
        this.loading.loading.dismiss();
        this.events.publish("Request:Error", err);
      });

  }

  previewImage(image) {
    this.modalCtrl.create({
      component: ImageModelPage,
      componentProps: {
        img: image
      }
    }).then((modal) => modal.present());
  }

  shareProduct(productID) {
    const msg = this.translate.instant('product_share_msg');
    const options = {
      message: msg,
      subject: '',
      files: ['', ''],
      url: `${this.globals.shareBaseURL}/#/product-details?id=${productID}`,
      chooserTitle: ''
    };

    this.socialSharing.shareWithOptions(options);
  }

  openSizeTable() {
    console.log('size table');
  }

  toggle(num) {
    if (num == 1) {

      this.toggled1 = !this.toggled1;
    }
    if (num == 2) {
      this.toggled2 = !this.toggled2;

    }
  }

  addoToCart() {
    if (this.globals.isLoggedIn) {
      if (!this.selectedOption && this.product.options.length > 0) {
        this.optionError = true;
        let message = this.translate.instant("please_select_all_options_first");
        this.toast.presentToast("danger", message, 3000);
      } else {
        let body;
        if (this.selectedOption == null || this.selectedOption == undefined) {
          body = {
            "product": this.productId,
            "quantity": 1,
          };
        } else {
          body = {
            "product": this.productId,
            "quantity": 1,
            "selectedOption": this.selectedOption._id
          };
        }

        this.loading.presentLoading();
        this.cartService.addToCart(body)
          .subscribe(data => {
            console.log(data);
            this.loading.loading.dismiss();
            this.toast.presentToast('success', this.translate.instant('added_to_cart_successfuly'), 2000);
          }, err => {
            this.loading.loading.dismiss();
            this.events.publish('Request:Error', err);
          });
      }
    } else {
      if (!this.selectedOption && this.product.options.length > 0) {
        this.optionError = true;
        let message = this.translate.instant("please_select_all_options_first");
        this.toast.presentToast("danger", message, 3000);
      } else {
        console.log("sending to offline cart");
        this.events.publish('offlineCart:change', this.product, this.selectedOption, true);
      }
    }

  }

  openProduct(product) {
    switch (this.globals.getActiveTab()) {
      case 'cart':
        this.router.navigate(['tabs/cart/product-detail', { productId: product._id }]);
        break;
      case 'favorite':
        this.router.navigate(['tabs/favorite/product-detail', { productId: product._id }]);
        break;
      default:
        this.router.navigate(['tabs/home/product-detail', { productId: product._id }]);
        break;
    }
  }

  hideAd() {
    this.adHidden = !this.adHidden;
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
            console.log(data);
            product.isInWishList = !product.isInWishList;
            this.loading.loading.dismiss();
          }, err => {
            this.events.publish("Request:Error", err);
            this.loading.loading.dismiss();
          });
      } else {
        this.toast.presentToast('warning', this.translate.instant('please_login_first'), 3000);
      }
    } else {
      this.loading.presentLoading();
      this.wishlistService.removeFromWishList(product._id)
        .subscribe(data => {
          console.log(data);
          product.isInWishList = !product.isInWishList;
          this.loading.loading.dismiss();
        }, err => {
          this.events.publish("Request:Error", err);
          this.loading.loading.dismiss();
        });
    }
  }


  optionChanged() {
    console.log("option changed");
    console.log(this.productOptions);
    console.log(this.product.options);


    for (let i = 0; i < this.product.options.length; i++) {
      if (this.productOptions[0] == this.product.options[i].value1 && this.productOptions[1] == this.product.options[i].value2) {
        console.log("found matching for:", this.productOptions[0], "and:", this.productOptions[1]);
        console.log(this.product.options[i]);
        this.selectedOption = this.product.options[i];
        if (this.selectedOption.images != null && this.selectedOption.images != undefined) {
          console.log("option has image");
        }
        this.optionError = false;
      }
    }

    if (this.selectedOption.quantity <= 0) {
      this.notEnoughQnt = true;
    }
  }
}

