import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Events, Platform } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  hideGoogle = true;
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  password = new FormControl('', [
    Validators.required,
  ]);

  public emailError = false;
  public passwordError = false;

  public hidden = true;

  // back
  subscription;
  public backButtonPressed = false;

  constructor(private toast: ToastService,
    private translate: TranslateService,
    public events: Events,
    private loading: LoadingService,
    private userService: UserService,
    private router: Router,
    private platform: Platform,
    private facebook: Facebook,
    private googlePlus: GooglePlus) {
    if (this.platform.is('android')) {
      this.hideGoogle = true;
    }
    else {
      this.hideGoogle = false;
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.backButtonPressed = false;
    this.subscription = this.platform.backButton.subscribe(() => {
      this.router.navigate(['tabs/home'], { replaceUrl: true });
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.backButtonPressed = false;
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

  checkPassword() {
    this.password.markAsTouched();

    if (!this.password.valid) {
      this.passwordError = true;
    }
    else {
      this.passwordError = false;
    }
  }
  changePassType(input: any) {
    this.hidden = !this.hidden;
    if (this.hidden) {
      input.type = "password";
    } else {
      input.type = "text";
    }
  }

  checkAll() {
    this.checkEmail();
    this.checkPassword();
    // if (this.emailError ||
    //   this.passwordError) {
    //   // alert("Please Enter Information Correctly");
    // } else {
    //   this.submit();
    // }
    if (!this.emailError &&
      !this.passwordError) {
      return true;
    }
    return false;
  }

  login() {
    const noError = this.checkAll();
    if (noError) {
      this.loading.presentLoading();
      this.userService.login(this.email.value.toLowerCase(), this.password.value)
        .subscribe((respone) => {
          this.events.publish('User:Login', respone);
          this.email.setValue('');
          this.password.setValue('');
          this.loading.loading.dismiss();
        }, (error) => {
          this.loading.dismiss();
          this.events.publish('User:LoginSignupError', error);
        });
    }
  }

  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }

  facebookLogin() {
    this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        if (res.status == 'connected') {
          console.log('logged into Facebook!', JSON.stringify(res));
          this.loading.presentLoading();
          this.facebook.api('me?fields=id,email,first_name,last_name', [])
            .then((profile) => {
              if (profile.email != undefined && profile.email != null && profile.email != '') {
                const data = {
                  access_token: res.authResponse.accessToken,
                  email: profile.email,
                  name: profile.first_name + ' ' + profile.last_name
                };
                console.log('FinalData: ', JSON.stringify(data));
                this.userService.facebookLogin(data)
                  .subscribe((serverResponse) => {
                    this.events.publish('User:Login', serverResponse);
                    this.loading.loading.dismiss();
                  }, (error) => {
                    this.loading.dismiss();
                    console.log('serverErr: ', JSON.stringify(error));
                    this.events.publish('User:LoginSignupError', error);
                  });
              }
            });
        }
      });
  }

  googleLogin() {
    this.googlePlus.login({
      webClientId: '97311029954-5n7dgdl8kkvgilo15atsnrdbcj46n1lh.apps.googleusercontent.com',
      offline: 'true',
      scopes: 'profile email'
    }).then((res) => {
      console.log(res);
      if (res.email != undefined && res.email != null && res.email != '' && res.accessToken != undefined && res.accessToken != null && res.accessToken != '') {
        this.loading.presentLoading();
        console.log('token: ', res.accessToken, 'Email: ', res.email);
        const data = {
          access_token: res.accessToken,
          email: res.email,
          name: res.givenName + ' ' + res.familyName
        };
        console.log('FinalData: ', JSON.stringify(data));
        this.userService.googleLogin(data)
          .subscribe((serverResponse) => {
            console.log('severResp: ', serverResponse);

            this.loading.loading.dismiss();
            this.events.publish('User:Login', serverResponse);
          }, (error) => {
            this.loading.dismiss();
            console.log('serverErr: ', JSON.stringify(error));
            this.events.publish('User:LoginSignupError', error);
          });
      }
      else {
        console.log('else');
      }
    })
      .catch((err) => {
        console.error('GoogleError: ', err);
      });
  }
}
// ionic cordova plugin add cordova-plugin-googleplus  --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.97311029954-9jkvfbap9egq7krgq1pa062isvm5pm0r
// Android 97311029954-o9poqcilkrln8j4in4h8rfeceankj6fl.apps.googleusercontent.com
//--variable WEB_APPLICATION_CLIENT_ID=97311029954-i9v8scgc06bodj2q71oeolvrv1fgs7iv.apps.googleusercontent.com
// 8A:8D:67:06:73:36:C9:FD:16:52:9F:E6:6A:6B:6C:EE:B6:A9:22:29