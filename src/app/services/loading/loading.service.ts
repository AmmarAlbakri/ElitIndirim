import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading: any;
  constructor(private loadingCtrl: LoadingController) { }

  async presentLoading(content?: string) {
    this.loading = await this.loadingCtrl.create({
      message: content || '',
      cssClass: 'loader',
      backdropDismiss: true
    });
    await this.loading.present();
  }

  async presentStickyLoader(content?: string) {
    this.loading = await this.loadingCtrl.create({
      message: content || '',
      cssClass: 'loader',
      backdropDismiss: false
    });
    await this.loading.present();
  }

  presentTimedLoading(period: number, content?: string) {
    this.loading = this.loadingCtrl.create({
      message: content || '',
      cssClass: 'loader',
      backdropDismiss: true
    });
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
    }, period);
  }

  async dismiss() {
    await this.loading.dismiss();
  }
}
