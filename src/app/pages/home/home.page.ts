import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, Events, IonContent, Platform, IonSegment } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AdsService } from 'src/app/services/ads/ads.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalsService } from 'src/app/services/globals/globals.service';



@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {

  @ViewChild('cats', { static: false }) slider: IonSlides;
  @ViewChild('content', { static: false }) content: IonContent;
  @ViewChild('seg', { static: true }) seg: IonSegment;


  segment = 0;
  input = '';
  categories;
  public ads: any[] = new Array();
  pageNum = 1;
  public isDownloadComplete = false;
  public pageNumArr = [];
  public isDownloadCompleteArr = [];
  // timeArray;

  slides: any;

  values = [{
    value: 10,
    checked: false,
  }, {
    value: 20,
    checked: false,
  }, {
    value: 30,
    checked: false,
  }, {
    value: 40,
    checked: false,
  }, {
    value: 50,
    checked: false,
  }, {
    value: 60,
    checked: false,
  }, {
    value: 70,
    checked: false,
  }, {
    value: 80,
    checked: false,
  }, {
    value: 90,
    checked: false,
  }, {
    value: 100,
    checked: false,
  }];

  // selected = 0;
  // tab_num = 0;
  // SWIPE_ACTION = { LEFT: "swipeleft", RIGHT: "swiperight" };

  // adHidden = false;


  // SwipedTabsIndicator: any = null;
  // tabs: any = [];
  visitiedIndexes: any[] = new Array();


  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    initialSlide: 0,
    autoPlay: true,
    speed: 400
  };

  categorySlideOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 0,
    initialSlide: 0,
    autoHeight: false
  };

  // public target_date;
  // public days;
  // public hours;
  // public minutes;
  // public seconds;

  subscription;
  public backButtonPressed = false;

  constructor(private router: Router, private categoryService: CategoryService, public events: Events,
    private loading: LoadingService, private adsService: AdsService, private platform: Platform,
    private toast: ToastService, private translate: TranslateService,
    private globalsService: GlobalsService
  ) {
    // this.getData();
    // this.input = "";
    // this.segment = 0;
  }

  ngOnInit() {
    this.getData();
    this.input = "";
    this.segment = 0;
  }

  ionViewWillEnter() {
    this.input = '';
  }

  getData() {
    this.getSlides();
    this.getCategories();
    // this.SetTimeForAds();
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
    this.visitiedIndexes.push(0);
  }

  getSlides() {
    this.adsService.getAllSliders()
      .subscribe(data => {
        // console.log(data);
        this.slides = data.slider;
      }, err => {
        this.events.publish("Request:Error", err);
      });
  }

  getCategories() {
    this.categoryService.getAllCategories()
      .subscribe((res) => {
        console.log("categories:", res);
        this.categories = res.data;
        this.ads = Array(this.categories.length);
        this.pageNumArr = Array(this.categories.length);
        this.isDownloadCompleteArr = Array(this.categories.length);
        for (let index = 0; index < this.pageNumArr.length; index++) {
          this.pageNumArr[index] = 1;
          this.isDownloadCompleteArr[index] = false;
        }
        this.getAds(this.segment);
      }, (err) => {
        this.events.publish("Request:Error", err);
      });
  }

  getAds(index = 0) {
    this.pageNumArr[index] = 1;
    this.isDownloadCompleteArr[index] = false;
    this.adsService.getAdsForCategory(this.categories[index]._id, 1, 100, this.pageNumArr[this.segment])
      .subscribe(response => {
        console.log("ads for category:", this.categories[index].name, response);
        this.ads[index] = response;
        if (this.ads[index].length == response['paging'].total) {
          this.isDownloadCompleteArr[this.segment] = true;
        }
        console.log("Ads are:", this.ads);
      }, err => {
        console.log(err);
        this.events.publish("Request:Error", err);
      });
  }


  goToPage(page) {
    this.router.navigate([page]);
  }

  search() {
    this.router.navigate(["tabs/home/search", { input: this.input }]);
  }

  filter(value) {
    this.pageNumArr[this.segment] = 1;
    this.isDownloadCompleteArr[this.segment] = false;
    value.checked = !value.checked;
    console.log("values:", this.values);

    this.ads[this.segment].data = [];
    let flag = 0;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].checked) {
        flag = 1;
        break;
      }
    }
    if (flag == 1) {
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i].checked) {
          console.log('i=', i, 'thisValues: ', this.values[i - 1].value + 1);

          this.adsService.getAdsForCategory(this.categories[this.segment]._id, i == 0 ? 1 : this.values[i - 1].value + 1, this.values[i].value, this.pageNumArr[this.segment])
            .subscribe(data => {
              console.log("filter by:", this.values[i].value, " for category:", this.categories[this.segment].name, " result is:", data);
              this.ads[this.segment].data = this.ads[this.segment].data.concat(data.data);
              this.ads[this.segment].paging = data.paging;
            }, err => {
              console.log(err);
            });
        }
      }
    } else {
      this.getAds(this.segment);
    }


  }

  SetTimeForAds() {
    // console.log("Setting time:",this.ads);
    // this.timeArray = new Array(this.ads.length);
    // console.log(this.ads.length);

    for (let i = 0; i < this.ads.length; i++) {
      console.log(" anythimg");
      for (let j = 0; j < this.ads[i].data.length; j++) {

        console.log("each ad indivicually", this.ads[i].data[j]);
      }
    }
  }

  segmentChange(i) {
    this.segment = i;
    // I pass in false to keep my page from scrolling vertically. YMMV
    this.centerSegmentLabel(i);
    this.slider.slideTo(i);

  }

  centerSegmentLabel(i) {
    const nativeSegment = document.getElementById('seg') as Element;
    let opts: ScrollIntoViewOptions;
    opts = {
      block: 'center',
      inline: 'center',
      behavior: 'smooth'
    };

    nativeSegment.children[i].scrollIntoView(opts);
  }

  slideWillChange(cats: IonSlides) {
    let index;
    this.values.map(a => a.checked = false);
    cats.getActiveIndex().then(data => {
      index = data;
      this.segmentChange(index);
      let flag = 0;
      for (let i = 0; i < this.visitiedIndexes.length; i++) {
        if (this.visitiedIndexes[i] == index) {
          flag = 1;
          this.getAds(this.segment);
        }
      }
      if (flag == 0) {
        this.visitiedIndexes.push(index);
        console.log(this.visitiedIndexes);
        this.getAds(this.segment);
        // this.content.scrollToTop(1500);
      }
    });


  }

  ionViewDidEnter() {
    this.globalsService.setActiveTab('home');
    this.backButtonPressed = false;
    this.subscription = this.platform.backButton.subscribe(() => {
      if (!this.backButtonPressed) {
        this.backButtonPressed = true;
        this.toast.presentToast('dark', this.translate.instant('exit_msg'), 3000);
        setTimeout(() => {
          this.backButtonPressed = false;
        }, 3000);
      }
      else {
        navigator['app'].exitApp();
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.backButtonPressed = false;
  }

  loadData(infiniteScrollEvent) {
    this.pageNumArr[this.segment] += 1;
    // this.ads[this.segment].data = [];
    let isPercentChecked = 0;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].checked) {
        isPercentChecked = 1;
      }
    }

    if (isPercentChecked == 1) {
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i].checked) {
          this.adsService.getAdsForCategory(this.categories[this.segment]._id, i == 0 ? 1 : this.values[i - 1].value + 1, this.values[i].value, this.pageNumArr[this.segment])
            .subscribe(data => {
              this.ads[this.segment].data = this.ads[this.segment].data.concat(data.data);
              infiniteScrollEvent.target.complete();
              if (this.ads[this.segment].data.length == data['paging'].total) {
                this.isDownloadCompleteArr[this.segment] = true;
              }
            }, err => {
              console.log(err);
              this.events.publish("Request:Error", err);
            });
        }
      }
    } else {
      this.adsService.getAdsForCategory(this.categories[this.segment]._id, 1, 100, this.pageNumArr[this.segment])
        .subscribe(data => {
          console.log(data);
          this.ads[this.segment].data = this.ads[this.segment].data.concat(data.data);
          infiniteScrollEvent.target.complete();
          if (this.ads[this.segment].data.length == data['paging'].total) {
            this.isDownloadCompleteArr[this.segment] = true;
          }
        }, err => {
          this.events.publish("Request:Error", err);
          console.log(err);
        });
      // this.slider.updateAutoHeight();

    }

    console.log('pageNumArr: ', this.pageNumArr);
    console.log("ads after paging:", this.ads);

  }

  goToSearchWithFilter(ad) {
    console.log('offer', ad);
    switch (ad.adsTargetType) {
      case 'category':
        this.searchWithCategory(ad);
        break;
      case 'brand':
        this.searchWithBrand(ad);
        break;
      default:
        break;
    }
  }

  searchWithCategory(ad) {
    this.router.navigate(['tabs/home/search', { catId: ad.adsRefId, discoutPercent: ad.discountPercent }]);
  }

  searchWithBrand(ad) {
    this.router.navigate(['tabs/home/search', { brandId: ad.adsRefId, discoutPercent: ad.discountPercent }]);
  }

  offerEnded(offer) {
    offer.limitedDate = false;
  }
}
