import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast: any;
  constructor(private toastCtrl: ToastController) { }

  async presentToast(color, message, duration = 1500) {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom',
      color: color,
      keyboardClose: true
    });
    await this.toast.present();
  }
}
