import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, Events } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-filter-model',
  templateUrl: './filter-model.page.html',
  styleUrls: ['./filter-model.page.scss'],
})
export class FilterModelPage implements OnInit {

  @ViewChild('slider', { static: false }) slides: IonSlides;

  options: [any];
  // colors;
  // sizes;

  page = "filter";
  dataSet;
  input;
  currentOption;

  category = {
    name: [],
    id: []
  };
  brand = {
    name: [],
    id: []
  };


  isHide = false;
  onlyFalse = false;

  SlideOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 0,
    initialSlide: 0
  };

  rangeValue = {
    lower: 1,
    upper: 100000
  };

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

  // selectedValues = {
  //   searchKeyword: '',
  //   category: '',
  //   categoryId: '',
  //   brand: '',
  //   options: [],
  //   brandId: '',
  //   minPrice: 1,
  //   maxPrice: 100000,
  //   // color: '',
  //   // size: '',
  //   filterByPriceRange: false
  // };

  selectedOptions = [];

  constructor(private modelCtrl: ModalController, private categoryService: CategoryService, private loading: LoadingService,
    public events: Events, private productsService: ProductsService) {

  }

  ngOnInit() {
    for (let i = 0; i < this.options.length; i++) {
      let obj = {
        option: this.options[i],
        selectedValue: ''
      }
      this.selectedOptions.push(obj);
    }
    console.log(this.selectedOptions);
    this.input = this.filter.searchWord;
    this.rangeValue.lower = this.filter.priceFrom;
    this.rangeValue.upper = this.filter.priceTo;
  }

  slidesDidLoad(slider) {
    slider.lockSwipes(true);
  }

  goTo(page) {
    this.page = page;
    if (page == "category") {
      this.loading.presentLoading();
      this.categoryService.getAllCategories()
        .subscribe(data => {
          console.log(data);
          this.dataSet = data.data.map(a => a.name);
          this.category.id = data.data.map(a => a._id);
          this.category.name = this.dataSet;
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.loading.loading.dismiss();
        }, err => {
          console.log(err);
          this.loading.loading.dismiss();
          this.events.publish("Request:Error");
        });
      // } else if (page == "color") {
      //   this.dataSet = this.colors;
      //   this.slides.lockSwipes(false);
      //   this.slides.slideNext();
      //   this.slides.lockSwipes(true);

    } else if (page == "brand") {
      this.loading.presentLoading();
      this.categoryService.getAllBrands()
        .subscribe(data => {
          console.log(data);
          this.dataSet = data.data.map(a => a.name);
          this.brand.id = data.data.map(a => a._id);
          this.brand.name = this.dataSet;
          console.log(this.dataSet);


          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.loading.loading.dismiss();
        }, err => {
          console.log(err);
          this.loading.loading.dismiss();
          this.events.publish("Request:Error");
        });

      // } else if (page == "size") {
      //   this.dataSet = this.sizes;
      //   this.slides.lockSwipes(false);
      //   this.slides.slideNext();
      //   this.slides.lockSwipes(true);

    } else if (page == "price") {
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
  }

  kill() {
    this.modelCtrl.dismiss();
  }

  dismissModel() {
    // this.selectedValues.searchKeyword = this.input;
    this.filter.searchWord = this.input;
    for (let i = 0; i < this.selectedOptions.length; i++) {
      if (this.selectedOptions[i].selectedValue) {
        const obj = {
          feature: this.selectedOptions[i].option.option,
          value: this.selectedOptions[i].selectedValue
        };
        console.log("obj is:", obj);
        // this.selectedValues.options.push(obj);
        this.filter.options.push(obj);
      }

    }
    console.log("final options are:", this.filter.options);

    this.modelCtrl.dismiss(this.filter);
  }

  slideBack() {
    this.rangeValue.lower = this.filter.priceFrom;
    this.rangeValue.upper = this.filter.priceTo;
    this.page = "filter";
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
    console.log("selected values:", this.filter);
    console.log("selected options:", this.selectedOptions);

  }

  applyRange() {
    if (this.rangeValue.upper >= this.rangeValue.lower) {
      this.filter.priceFrom = this.rangeValue.lower;
      if (this.rangeValue.upper > 1000000) {
        this.filter.priceTo = 100000;
      }
      else {
        this.filter.priceTo = this.rangeValue.upper;
      }
    }
    else {
      this.filter.priceFrom = 1;
      this.filter.priceTo = 100000;
    }
    this.filter.filterByPriceRange = true;
    this.page = "filter";
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  clearFilters() {
    this.filter = {
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
    // this.selectedValues = {
    //   options: [],
    //   category: '',
    //   categoryId: '',
    //   brand: '',
    //   brandId: '',
    //   minPrice: 0,
    //   maxPrice: 0,
    //   searchKeyword: '',
    //   filterByPriceRange: false
    // };
    this.input = '';
    this.dismissModel();
  }

  goToOptions(option) {
    this.page = 'option';
    this.dataSet = option.option.value;
    this.currentOption = option;
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  selectValue(value) {
    console.log(value);
    if (this.page == 'category') {
      this.filter.categoryName = value;
      // this.selectedValues.category = value;
      for (let i = 0; i < this.dataSet.length; i++) {
        if (this.category.name[i] == value) {
          this.filter.category = this.category.id[i];
          // this.selectedValues.categoryId = this.category.id[i];
        }
      }
    } else if (this.page == 'option') {

      this.currentOption.selectedValue = value;
    }

    else if (this.page == 'brand') {
      this.filter.brandName = value;
      // this.selectedValues.brand = value;
      for (let i = 0; i < this.dataSet.length; i++) {
        if (this.brand.name[i] == value) {
          this.filter.brand = this.brand.id[i];
          // this.selectedValues.categoryId = this.brand.id[i];
        }
      }
    }

    this.slideBack();

  }

}
