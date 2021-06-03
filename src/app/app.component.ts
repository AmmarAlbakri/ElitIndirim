import { Component } from '@angular/core';

import { Platform, MenuController, Config, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoadingService } from './services/loading/loading.service';
import { GlobalsService } from './services/globals/globals.service';
import { UserService } from './services/user/user.service';
import { CartService } from './services/cart/cart.service';
import { ToastService } from './services/toast/toast.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public dir: string;
  public isLoggedIn = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private router: Router,
    private sideMenuCtrl: MenuController,
    private config: Config,
    private loading: LoadingService,
    public globals: GlobalsService,
    public events: Events,
    private userService: UserService,
    private toast: ToastService,
    private cartService: CartService,
    private keyboard: Keyboard
  ) {
    if (localStorage.getItem('user') == null || localStorage.getItem('user') === undefined) {
      this.globals.name = this.translate.instant('guest');
      // this.sideMenuCtrl.enable(false);
    }
    this.initializeApp();
    events.subscribe('User:Login', (response) => {
      console.log("Login: ", response);
      const user = {
        id: response._id,
        token: response.token,
        name: response.name,
        email: response.email
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.globals.isLoggedIn = true;
      this.isLoggedIn = true;
      this.globals.name = response.name;
      // this.sideMenuCtrl.enable(true);
      this.events.publish('refresh:set', true);
      this.router.navigate(['tabs/home'], { replaceUrl: true });
      // this.toast.presentToast('success', this.translate.instant("login_success"),1500);
      if (this.globals.products.length > 0) {
        this.syncOfflineCart();
      }
    });
    events.subscribe('User:Logout', () => {
      console.log("Logout");
      localStorage.removeItem('user');
      this.globals.name = this.translate.instant('guest');
      this.globals.isLoggedIn = false;
      this.isLoggedIn = false;
      this.events.publish('refresh:set', true);
      this.sideMenuCtrl.close();
      // this.sideMenuCtrl.enable(false);
      this.router.navigate(['tabs/home'], { replaceUrl: true });
      // this.toast.presentToast('success', this.translate.instant("logout_success"), 1500);
      this.events.publish('offlineCart:remove', 1, true);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.config.set('backButtonText', '');
      this.keyboard.hideFormAccessoryBar(false);
      this.initTranslate();
      this.checkUser();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // let selectedLang = localStorage.getItem("selectedLanguage");
    // if (selectedLang == null || selectedLang == undefined) {
    //   selectedLang = navigator.language.toString();
    //   console.log("sl= ", selectedLang);

    //   selectedLang = selectedLang.split("-")[0];
    //   if (selectedLang == "ar") {
    //     selectedLang = "ar";
    //   }
    //   else if (selectedLang == 'tr') {
    //     selectedLang = 'tr';
    //   }
    //   else {
    //     selectedLang = 'en'; //'en';
    //   }
    //   localStorage.setItem("selectedLanguage", selectedLang);
    // }

    this.dir = "ltr";
    document.documentElement.dir = "ltr";
    let selectedLang = 'tr';
    localStorage.setItem("selectedLanguage", selectedLang);
    this.translate.setDefaultLang('tr');   //('en');
    this.translate.use(selectedLang);
  }

  goToPage(page) {
    this.router.navigate([page]);
    this.sideMenuCtrl.close();
  }
  checkUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null && user != undefined) {
      this.globals.isLoggedIn = true;
      this.isLoggedIn = true;
      this.globals.name = user.name;
    }
    else {
      this.globals.isLoggedIn = false;
      this.isLoggedIn = false;
      this.globals.name = this.translate.instant('guest');
    }
  }
  openInfo(page) {
    this.router.navigate(['info'], { queryParams: page });
    this.sideMenuCtrl.close();
  }
  logout() {
    this.loading.presentLoading();
    this.userService.logout()
      .subscribe((res) => {
        console.log(res);
        this.events.publish("User:Logout");
        this.loading.dismiss();
      }, (err) => {
        this.events.publish("Request:Error");
        this.loading.dismiss();
      });
  }

  syncOfflineCart() {
    this.cartService.syncOfflineCart(this.globals.products)
      .subscribe((response) => {
        this.events.publish('offlineCart:remove', 1, true);
        console.log('succes sync offline cart: ', response);
      }, (error) => {
        console.log('error sync offline cart ', error);
      });
  }
}
