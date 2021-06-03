import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // back
  subscription;
  public backButtonPressed = false;

  constructor(private router: Router, private alertController: AlertController,
    private trasnlate: TranslateService, public globals: GlobalsService, private userService: UserService, public events: Events,
    private loading: LoadingService, private sideMenuCtrl: MenuController, private platform: Platform,
    private callNumber: CallNumber
  ) {
    if (!globals.isLoggedIn) {
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log("ionVireDidEnter");
    this.globals.setActiveTab('profile');
    this.backButtonPressed = false;
    this.subscription = this.platform.backButton.subscribe(() => {
      this.router.navigate(['tabs/home']);
    });
  }

  ionViewWillLeave() {
    console.log("will leave");

    this.subscription.unsubscribe();
    this.backButtonPressed = false;
  }

  goToPage(page) {
    this.router.navigate([page]);
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

  callPopup() {
    this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.trasnlate.instant("phone_number_value"),
      message: this.trasnlate.instant("call_confirm_body_text"),
      buttons: [
        {
          text: this.trasnlate.instant("cancel"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.trasnlate.instant("call"),
          cssClass: 'primary',
          handler: () => {
            this.call('00905352850401');
          }
        }
      ]
    });
    await alert.present();
  }

  call(num) {
    this.callNumber.callNumber(num, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  openInfo(page) {
    // this.router.navigate(['tabs/profile/info'], { queryParams: { pageName: page } });
    this.router.navigate(['tabs/profile/info', { pageName: page }]);
    this.sideMenuCtrl.close();
  }
}
