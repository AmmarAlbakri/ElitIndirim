import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy, NavParams } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import "hammerjs";
// import {
//   HammerGestureConfig,
//   HAMMER_GESTURE_CONFIG
// } from "@angular/platform-browser";
import { PipesModule } from './pipes/pipes.module';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { MatInputModule } from '@angular/material/input';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ImageModelPageModule } from './pages/image-model/image-model.module';
import { FilterModelPageModule } from './pages/filter-model/filter-model.module';
import { ApiInterceptorService } from './services/apiInterceptor/api-interceptor.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// export class BaluHammerConfig extends HammerGestureConfig {
//   overrides = {
//     pan: {
//       direction: 6
//     },
//     pinch: {
//       enable: false
//     },
//     rotate: {
//       enable: false
//     }
//   };
// }

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ImageModelPageModule,
    FilterModelPageModule,
    IonicStorageModule.forRoot(),
    CountdownTimerModule.forRoot()
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: BaluHammerConfig
    // },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
    SocialSharing,
    WebView,
    Camera,
    FilePath,
    File,
    IonicStorageModule,
    Facebook,
    GooglePlus,
    InAppBrowser,
    Keyboard,
    CallNumber
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
