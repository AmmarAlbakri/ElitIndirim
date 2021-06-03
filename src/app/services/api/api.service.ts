import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { LoadingService } from '../loading/loading.service';
import { AlertService } from '../alert/alert.service';
import * as httpStatusCodes from 'http-status-codes';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public oldBaseURL = 'https://elit.zerofullsolution.com/api';
  public newBaseURL = 'https://newelite.zerofullsolution.com/api';
  public baseURL = 'https://newelite.zerofullsolution.com/api';
  public shareBaseURL = 'https://elitindirim.com';
  constructor(
    public http: HttpClient,
    public events: Events,
    public toast: ToastService,
    public loading: LoadingService,
    public alert: AlertService,
    public translate: TranslateService) {
    this.events.subscribe('Request:Error', (error) => {
      console.log('er', error);
      try {
        switch (error.status) {
          case httpStatusCodes.INTERNAL_SERVER_ERROR:
            const err = error.error.message;
            if (err != null && err != undefined && err != '') {
              this.toast.presentToast('danger', error.error.message, 3000);
            }
            else {
              this.toast.presentToast('danger', this.translate.instant('server_error'), 3000);
            }
            break;
          case httpStatusCodes.UNAUTHORIZED:
            this.toast.presentToast('danger', error.error.message, 2000);
            this.events.publish('User:Logout');
            break;
          case 0: {
            const err = error.error.message;
            if (err != null && err != undefined && err != '') {
              this.toast.presentToast('danger', error.error.message, 3000);
            }
            else {
              this.toast.presentToast('danger', this.translate.instant('server_error'), 3000);
            }
            break;
          }
          default: {

            this.toast.presentToast('danger', error.error.message, 2000);
            break;
          }
        }
      }
      catch (e) {
        if (this.loading.loading && !this.loading.loading._detached) {
          this.loading.dismiss();
        }
      }
    });

    this.events.subscribe('User:LoginSignupError', (error) => {
      console.log('loginError: ', JSON.stringify(error));
      try {
        console.log('loginError: ', error.error.message);
        this.toast.presentToast('danger', error.error.message, 2000);
      }
      catch (e) {
        if (this.loading.loading && !this.loading.loading._detached) {
          this.loading.loading.dismiss();
        }
      }
    });
  }

  get(endPoint: string): Observable<any> {
    return this.http.get(this.baseURL + endPoint);
  }

  post(endPoint: string, body: any): Observable<any> {
    return this.http.post(this.baseURL + endPoint, body);
  }

  delete(endPoint: string): Observable<any> {
    return this.http.delete(this.baseURL + endPoint);
  }

  put(endpoint: string, body: any): Observable<any> {
    return this.http.put(this.baseURL + endpoint, body);
  }

  localGet(endPoint: string): Observable<any> {
    return this.http.get(endPoint);
  }
}
