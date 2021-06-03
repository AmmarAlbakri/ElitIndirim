import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { HomePage } from "./home.page";
import { MatTabsModule } from "@angular/material/tabs";
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CountdownTimerModule } from 'ngx-countdown-timer';

const routes: Routes = [
  {
    path: "",
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    TranslateModule.forChild(),
    PipesModule,
    CountdownTimerModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {

}
