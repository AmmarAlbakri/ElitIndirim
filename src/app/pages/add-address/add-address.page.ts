import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, Events } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {

  public isNewAddress = true;
  private AddressId;


  cities;
  subLocalties;


  fullName = new FormControl('', [
    Validators.required,
  ]);
  header = new FormControl('', [
    Validators.required,
  ]);
  phone = new FormControl('', [
    Validators.required,
    Validators.minLength(11)
  ]);
  address = new FormControl('', [
    Validators.required,
  ]);
  postal = new FormControl('', [
    Validators.required,
  ]);
  passport = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(15)
  ]);

  city: any;
  subLocalty: any;


  public fullNameError = false;
  public headerError = false;
  public cityError = false;
  public subLocaltyError = false;
  public phoneError = false;
  public addressError = false;
  public postalError = false;
  public passportError = false;

  constructor(private userService: UserService, private router: Router, private toast: ToastService, private translate: TranslateService,
    private route: ActivatedRoute, private loading: LoadingService, private navCtrl: NavController, public events: Events) {


    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        let addressToBeEdited = this.router.getCurrentNavigation().extras.state.address;
        console.log("address edit ", addressToBeEdited);
        this.isNewAddress = false;

        this.fullName.setValue(addressToBeEdited.fullName);
        this.header.setValue(addressToBeEdited.addressName);
        this.phone.setValue(addressToBeEdited.phone);
        this.address.setValue(addressToBeEdited.address);
        this.postal.setValue(addressToBeEdited.postal);
        this.passport.setValue(addressToBeEdited.passport);
        this.setCityAndSub(addressToBeEdited.city, addressToBeEdited.state);
        // this.city = addressToBeEdited.city;
        // this.subLocalties = this.cities.filter(e => e.name == this.city)[0].counties;
        // this.subLocalty = addressToBeEdited.state;

        this.AddressId = addressToBeEdited._id;
      } else {
        this.getAllCitiesLocal();
      }
    });
  }

  ngOnInit() {

  }

  getAllCitiesLocal() {
    this.userService.getAllCitiesLocal()
      .subscribe((response) => {
        console.log(response);
        this.cities = response;
        // if (this.cities) {
        //    this.subLocalties = this.cities.filter(e => e.name == this.city)[0].counties;
        // }
      }, (error) => {
        console.log('error get cities', error);
      });
  }

  setCityAndSub(city, sub) {
    this.userService.getAllCitiesLocal()
      .subscribe((response) => {
        console.log(response);
        this.cities = response;
        this.city = city;
        this.subLocalties = this.cities.filter(e => e.name == this.city)[0].counties;
        this.subLocalty = sub;
      }, (error) => {
        console.log('error get cities', error);
      });
  }


  cityChanged($event) {
    this.city = $event.detail.value;
    if (this.city == undefined || this.city == null) {
      this.cityError = true;
    }
    this.subLocalties = this.cities.filter(e => e.name == this.city)[0].counties;
  }

  subLocaltyChanged($event) {
    this.subLocalty = $event.detail.value;
    if (this.subLocalty == undefined || this.subLocalty == null) {
      this.subLocaltyError = true;
    }
    console.log(this.subLocalty);
  }

  checkFullName() {
    this.fullName.markAsTouched();

    if (!this.fullName.valid) {
      this.fullNameError = true;
    }
    else {
      this.fullNameError = false;
    }
  }

  checkPhone() {
    this.phone.markAsTouched();

    if (!this.phone.valid) {
      this.phoneError = true;
    }
    else {
      this.phoneError = false;
    }
  }

  checkPostal() {
    this.postal.markAsTouched();
    if (!this.postal.valid) {
      this.postalError = true;
    }
    else {
      this.postalError = false;
    }
  }

  checkPassport() {
    this.passport.markAsTouched();
    if (!this.passport.valid) {
      this.passportError = true;
    }
    else {
      this.passportError = false;
    }
  }

  checkAddress() {
    this.address.markAsTouched();

    if (!this.address.valid) {
      this.addressError = true;
    }
    else {
      this.addressError = false;
    }
  }

  checkHeader() {
    this.header.markAsTouched();

    if (!this.header.valid) {
      this.headerError = true;
    }
    else {
      this.headerError = false;
    }
  }

  checkCity() {

    if (this.city == undefined || this.city == null) {
      this.cityError = true;
    } else {
      this.cityError = false;
    }
  }
  checkSubLocalty() {

    if (this.subLocalty == undefined || this.subLocalty == null) {
      this.subLocaltyError = true;
    } else {
      this.subLocaltyError = false;
    }
  }




  checkAll() {

    this.checkFullName();
    this.checkPhone();
    this.checkAddress();
    this.checkHeader();
    this.checkPostal();
    this.checkCity();
    this.checkPassport();
    this.checkSubLocalty();

    if (this.cityError ||
      this.phoneError ||
      this.postalError ||
      this.subLocaltyError ||
      this.headerError ||
      this.fullNameError ||
      this.addressError
    ) {
      //   alert("Please Enter All Information Correctly");
    } else {
      if (this.isNewAddress) {
        this.onSubmit();
      } else {
        this.editAddress();
      }
    }

  }

  onSubmit() {
    this.loading.presentLoading();
    const data = {
      "addressName": this.header.value,
      "fullName": this.fullName.value,
      "city": this.city,
      "country": "Turkey",
      "state": this.subLocalty,
      "address": this.address.value,
      "postal": this.postal.value,
      "phone": String(this.phone.value),
      "type": "1",
      "passport": String(this.passport.value)
    };


    this.userService.addAddress(data)
      .subscribe((res) => {
        this.loading.loading.dismiss();
        this.toast.presentToast('success', this.translate.instant("address_addedd_successfuly"));
        this.events.publish('address:change');
        this.navCtrl.back();
      }, (err) => {
        this.loading.loading.dismiss();
        this.events.publish('Request:Error', err);
      });

  }

  editAddress() {
    this.loading.presentLoading();
    const data = {
      "addressName": this.header.value,
      "fullName": this.fullName.value,
      "city": this.city,
      "country": "Turkey",
      "state": this.subLocalty,
      "address": this.address.value,
      "postal": String(this.postal.value),
      "phone": String(this.phone.value),
      "type": "1",
      "passport": String(this.passport.value)
    };
    this.userService.editAddress(this.AddressId, data)
      .subscribe((res) => {
        console.log('res', res);
        this.events.publish('address:change');
        this.toast.presentToast('success', this.translate.instant("address_edited_successfuly"));
        this.loading.loading.dismiss();
        this.navCtrl.back();
      }, (err) => {
        this.loading.loading.dismiss();
        this.events.publish('Request:Error', err);
      });


  }
}
