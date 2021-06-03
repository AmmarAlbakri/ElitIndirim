import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Events } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {


  fullName = new FormControl('', [
    Validators.required,
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  message = new FormControl('', [
    Validators.required,
  ]);
  phone = new FormControl('', [
    Validators.required,
    Validators.minLength(11)
  ]);

  messageError = false;
  emailError = false;
  phoneError = false;
  fullNameError = false;

  type;

  constructor(private toast: ToastService,
    private translate: TranslateService,
    private userService: UserService,
    private loading: LoadingService,
    public events: Events,
    private globals: GlobalsService) {
    if (this.globals.isLoggedIn) {
      this.setInitialValues();
    }
  }

  ngOnInit() {
  }

  setInitialValues() {
    this.loading.presentLoading();
    this.userService.getUserProfile()
      .subscribe(data => {
        console.log(data);
        this.fullName.setValue(data.data.name);
        this.email.setValue(data.data.email);
        this.phone.setValue(data.data.phone);
        this.fullName.disable();
        this.email.disable();
        this.phone.disable();
        this.loading.loading.dismiss();
      }, err => {
        this.events.publish("Reqeuest:Error", err);
        this.loading.loading.dismiss();
      });
  }

  checkFullName() {
    this.fullName.markAsTouched();
    this.fullName.enable();
    if (this.fullName.valid) {
      this.fullNameError = false;
      console.log('fullNameError:false');
    }
    else {
      this.fullNameError = true;
      console.log('fullNameError:true');
    }
    this.fullName.disable();
  }
  checkEmail() {
    this.email.markAsTouched();
    this.email.enable();
    if (this.email.valid) {
      this.emailError = false;
      console.log('emailError:false');
    }
    else {
      this.emailError = true;
      console.log('emailError:true');
    }
    this.email.disable();
  }
  checkPhone() {
    this.phone.markAsTouched();
    this.phone.enable();
    if (this.phone.valid) {
      this.phoneError = false;
      console.log('phoneError:false');
    }
    else {
      this.phoneError = true;
      console.log('phoneError:true');
    }
    this.phone.disable();
  }

  checkMessage() {
    this.message.markAsTouched();
    this.checkFullName();
    if (this.message.valid) {
      this.messageError = false;
      console.log('messageError:false');
    } else {
      this.messageError = true;
      console.log('messageError:true ');
    }
  }

  checkAll() {
    this.checkMessage();
    this.checkEmail();
    this.checkPhone();
    this.checkFullName();
    if (!this.messageError &&
      !this.emailError &&
      !this.phoneError &&
      !this.fullNameError) {
      this.submit();
    } else {
      alert('');
    }
  }

  submit() {
    this.loading.presentLoading();
    const body = {
      "name": this.fullName.value,
      "email": this.email.value,
      "message": this.message.value,
      "phone": this.phone.value
    };
    this.userService.contactUs(body)
      .subscribe(data => {
        console.log(data);
        this.loading.loading.dismiss();
        this.toast.presentToast('success', this.translate.instant("message_sent_successfuly"), 3000);
      }, err => {
        this.loading.loading.dismiss();
        this.events.publish("Request:Error", err);
      });

  }

}
