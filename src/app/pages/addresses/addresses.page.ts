import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertController, Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {


  noItems;
  addresses: any;



  constructor(private router: Router, private userService: UserService, private loading: LoadingService,
    private events: Events, private alertCtrl: AlertController, private translateService: TranslateService
  ) {
    this.events.subscribe('address:change', (address) => {
      this.getAddresses();
    });
  }

  ngOnInit() {
    this.getAddresses();
  }


  getAddresses() {
    this.loading.presentLoading();
    this.userService.getAddresses()
      .subscribe((response) => {
        console.log(response);
        this.addresses = response.data;
        this.loading.loading.dismiss();
        if (this.addresses.length < 1) {
          this.noItems = true;
        } else {
          this.noItems = false;
        }
      }, (error) => {
        this.loading.loading.dismiss();
        this.events.publish('Request:Error', error);
      });
  }

  async delAddressAlert(address, index) {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('deleting_address_header'),
      message: this.translateService.instant('deleting_address_msg'),
      buttons: [
        {
          text: this.translateService.instant('cancel'),
          role: 'cancel',
          handler: () => {
            console.log('delAddr canceled!');
          }
        },
        {
          text: this.translateService.instant('ok'),
          handler: () => {
            this.deleteAddress(address, index);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteAddress(address, index) {
    this.loading.presentLoading();
    this.userService.deleteAddress(address._id)
      .subscribe((response) => {
        console.log(response);
        this.loading.loading.dismiss();
        this.addresses.splice(index, 1);
        if (this.addresses.length <= 0) {
          this.noItems = true;
        }
        else {
          this.noItems = false;
        }
      }, (error) => {
        this.loading.loading.dismiss();
        this.events.publish('Request:Error', error);
      });
  }

  goToPage(page) {
    this.router.navigate(['tabs/profile/' + page]);
  }

  editAddress(address) {
    const navigationExtras: NavigationExtras = {
      state: {
        address: address
      }
    };
    this.router.navigate(['tabs/profile/add-address'], navigationExtras);

  }

}
