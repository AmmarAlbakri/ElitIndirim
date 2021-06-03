import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { Events, NavController } from '@ionic/angular';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {

  genders = ["male", "female"];

  fullName = new FormControl('', [
    Validators.required,
  ]);
  passport = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(15)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  phone = new FormControl('', [
    Validators.required,
    Validators.maxLength(11),
  ]);
  // birthDate = new FormControl('', [
  //   Validators.required,
  // ]);
  // gender = new FormControl('', [
  //   Validators.required,
  // ]);

  public fullNameError = false;
  public passportError = false;
  public emailError = false;
  public phoneError = false;
  // public genderError = false;
  // public birthDateError = false;


  constructor(private navCtrl: NavController,
    private toast: ToastService,
    public events: Events,
    private translate: TranslateService,
    private loading: LoadingService,
    private userService: UserService,
    private globals: GlobalsService) {
    this.getProfile();
  }

  ngOnInit() {
  }


  getProfile() {
    this.loading.presentLoading();
    this.userService.getUserProfile()
      .subscribe((res) => {
        console.log(res);
        this.email.setValue(res.data.email);
        this.email.disable();
        this.phone.setValue(res.data.phone);
        this.fullName.setValue(res.data.name);
        this.passport.setValue(res.data.passport);
        this.updateUserName(res.data.name);
        // if (res.data.gender == 1) {
        //   this.gender.setValue("female");
        // } else {
        //   this.gender.setValue("male");
        // }
        this.loading.loading.dismiss();
      }, (err) => {
        this.loading.loading.dismiss();
        this.events.publish("Request:Error", err);
      });
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
  checkPassport() {
    this.passport.markAsTouched();
    if (!this.fullName.valid) {
      this.passportError = true;
    }
    else {
      this.passportError = false;
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
  // checkGender() {
  //   this.gender.markAsTouched();
  //   if (!this.gender.valid) {
  //     this.genderError = true;
  //   }
  //   else {
  //     this.genderError = false;
  //   }
  // }
  // checkBirthDate() {
  //   this.birthDate.markAsTouched();

  //   if (!this.birthDate.valid) {
  //     this.birthDateError = true;
  //   } else {
  //     this.birthDateError = false;
  //   }
  // }
  checkAll() {
    this.checkFullName();
    this.checkPhone();
    // this.checkGender();
    // this.checkBirthDate();
    if (this.emailError ||
      this.phoneError ||
      // this.genderError ||
      this.passportError ||
      // this.birthDateError ||
      this.fullNameError
    ) {
      // alert("Please Enter All Information Correctly");
    } else {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.loading.presentLoading();
    // let g;
    // if (this.gender.value == "female") {
    //   g = 1;
    // } else {
    //   g = 2;
    // }
    const data = {
      "email": this.email.value,
      "name": this.fullName.value,
      "phone": String(this.phone.value),
      "passport": String(this.passport.value),
      // "gender": g
    };
    this.userService.editUserProfile(data)
      .subscribe((res) => {
        console.log(res);
        this.updateUserName(res.data.name);
        this.loading.loading.dismiss();
        this.toast.presentToast('success', this.translate.instant("personal_information_edited_successfuly"), 3000);
      }, (err) => {
        this.loading.loading.dismiss();
        this.events.publish("Request:Error", err);
      });
    this.navCtrl.back();
  }

  updateUserName(name) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null && user != undefined) {
      user.name = name;
      this.globals.name = name;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}
