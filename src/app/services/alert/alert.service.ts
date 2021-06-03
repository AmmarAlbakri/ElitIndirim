import { Injectable } from '@angular/core';
import { AlertController, Events, ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert: any;
  constructor(private alertCtrl: AlertController,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService) { }

  async presentAlert() {
    let alerting = await this.alertCtrl.create({
      header: 'hdr',
      message: 'msg',
      buttons: [
        {
          text: 'a',
          handler: () => {

          }
        }

      ]
    });
    await alerting.present();
  }

  // async changeLangAlert() {
  //   let changeLangAlert = await this.alertCtrl.create({
  //     // header: "Choose your language",
  //     buttons: [
  //       {
  //         text: 'English',
  //         cssClass: 'alert-lang',
  //         handler: () => {
  //           this.events.publish('lang:set', 'en');
  //         }
  //       },
  //       {
  //         text: 'العربية',
  //         cssClass: 'alert-lang',
  //         handler: () => {
  //           this.events.publish('lang:set', 'ar');
  //         }
  //       }//,
  //       // {
  //       //   text: "Turkçe",
  //       //   cssClass: 'alert-lang',
  //       //   handler: () => {
  //       //     this.events.publish('lang:set', "tr");
  //       //   }
  //       // }
  //     ]
  //   });
  //   await changeLangAlert.present();
  // }

  async changeLangAlert() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('choose_lang'),
      buttons: [{
        text: 'English',
        handler: () => {
          this.events.publish('lang:set', 'en');
        }
      }, {
        text: 'العربية',
        handler: () => {
          this.events.publish('lang:set', 'ar');
        }
      }, {
        text: 'Türkçe',
        handler: () => {
          this.events.publish('lang:set', 'tr');
        }
      }, {
        text: this.translate.instant('cancel'),
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async changeCurrencyAlert() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('choose_currency'),
      buttons: [{
        text: this.translate.instant('USD'),
        handler: () => {
          this.events.publish('currency:set', 'USD');
        }
      }, {
        text: this.translate.instant('TRY'),
        handler: () => {
          this.events.publish('currency:set', 'TRY');
        }
      }, {
        text: this.translate.instant('cancel'),
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
