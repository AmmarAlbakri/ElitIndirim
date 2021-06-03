import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  genders = ["male", "female"];


  public isFirstChecked = false;
  public isSeconedChecked = false;

  firstName = new FormControl('', [
    Validators.required,
  ]);
  lastName = new FormControl('', [
    Validators.required,
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  phone = new FormControl('', [
    Validators.required,
    Validators.minLength(11)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  birthDate = new FormControl('', [
    Validators.required,
  ]);
  gender = new FormControl('', [
    Validators.required,
  ]);


  public firstNameError = false;
  public lastNameError = false;
  public emailError = false;
  public phoneError = false;
  public genderError = false;
  public birthDateError = false;
  public passwordError = false;
  public confirmPasswordError = false;
  public isfirstCheckedError = false;


  constructor(private toast: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private userService: UserService,
    public events: Events,
    private router: Router) {
  }

  ngOnInit() {
  }



  checkFirstName() {
    this.firstName.markAsTouched();

    if (!this.firstName.valid) {
      this.firstNameError = true;
    }
    else {
      this.firstNameError = false;
    }
  }
  checkLastName() {
    this.lastName.markAsTouched();

    if (!this.lastName.valid) {
      this.lastNameError = true;
    }
    else {
      this.lastNameError = false;
    }
  }
  checkEmail() {
    this.email.markAsTouched();

    if (!this.email.valid) {
      this.emailError = true;
    }
    else {
      this.emailError = false;
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
  checkPassword() {
    this.password.markAsTouched();

    if (this.password.valid) {
      this.passwordError = false;
    }
    else {
      this.passwordError = true;
    }
  }
  checkConfirmPassword() {
    this.confirmPassword.markAsTouched();

    if (!this.confirmPassword.valid) {
      this.confirmPasswordError = true;
    }
    else if (this.confirmPassword.value != this.password.value) {
      this.confirmPasswordError = true;
    }
    else {
      this.confirmPasswordError = false;
    }
  }
  checkIsFirsthecked() {

    if (!this.isFirstChecked) {
      this.isfirstCheckedError = true;
    }
    else {
      this.isfirstCheckedError = false;
    }
  }
  checkGender() {
    this.gender.markAsTouched();

    if (!this.gender.valid) {
      this.genderError = true;
    }
    else {
      this.genderError = false;
    }
  }
  checkBirthDate() {
    this.birthDate.markAsTouched();

    if (!this.birthDate.valid) {
      this.birthDateError = true;
    } else {
      this.birthDateError = false;
    }

  }
  checkAll() {
    this.checkFirstName();
    this.checkLastName();
    this.checkEmail();
    this.checkPhone();
    this.checkPassword();
    this.checkConfirmPassword();
    this.checkIsFirsthecked();
    // this.checkGender();
    // this.checkBirthDate();
    if (this.emailError ||
      this.phoneError ||
      // this.genderError ||
      this.lastNameError ||
      this.passwordError ||
      // this.birthDateError ||
      this.firstNameError ||
      this.isfirstCheckedError ||
      this.confirmPasswordError) {
      // alert("Please Enter All Information Correctly");
    } else {
      this.onSubmit();
    }

  }

  onSubmit() {
    this.loading.presentLoading();
    const userData = {
      'name': this.firstName.value + ' ' + this.lastName.value,
      'email': this.email.value,
      'phone': this.phone.value,
      'password': this.password.value
    };
    this.userService.signup(userData)
      .subscribe((response) => {
        console.log(response);
        this.events.publish('User:Login', response);
        this.loading.loading.dismiss();
        this.toast.presentToast('success', this.translate.instant("account_created_succesfuly"), 3000);
      }, (error) => {
        this.events.publish('User:LoginSignupError', error);
        this.loading.loading.dismiss();
      });
  }

  openInfo(page) {
    // this.router.navigate(['info'], { queryParams: { pageName: page } });
    this.router.navigate(['info', { pageName: page }]);
  }
}
