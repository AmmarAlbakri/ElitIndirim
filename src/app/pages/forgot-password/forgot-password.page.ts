import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { Events, NavController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {


  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  emailError = false;
  
  constructor(private loading: LoadingService, private userService:UserService, private translate: TranslateService,
     public events: Events, private toast: ToastService, private navCtrl: NavController) { }

  ngOnInit() {
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

  checkAll() {
    this.checkEmail();
    if (this.emailError 
      ) {
      // alert("Please Enter Information Correctly");
    } else {
      this.submit();
    }
  }
  
  submit() {
    this.loading.presentLoading();
    const body = {
      email: this.email.value
    }
    this.userService.forgotPassword(body)
      .subscribe((res) => {
        console.log(res);
        this.toast.presentToast('success', this.translate.instant("an_email_has_been_sent"));
        this.loading.loading.dismiss();
        this.navCtrl.back();
      }, (error) => {
        this.loading.dismiss();
        this.events.publish('Request:Error', error);
      });
  }

}
