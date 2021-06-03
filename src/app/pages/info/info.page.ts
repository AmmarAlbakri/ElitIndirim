import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  public pageName = '';
  public pageContent;

  constructor(private loading: LoadingService,
    private userService: UserService,
    private events: Events,
    private route: ActivatedRoute,
    public globals: GlobalsService) {
  }

  ngOnInit() {
    this.pageName = this.route.snapshot.params['pageName'];
    const content = this.route.snapshot.params['content'];
    if (this.pageName != '') {
      this.getInfoPage();
    }
    if (content != '' && content != null && content != undefined) {
      this.pageContent = content;
    }
  }
  ionViewWillEnter() {
    // console.log("ionViewWillEnter");
    // this.route.queryParams.subscribe(params => {
    //   this.pageName = params['pageName'];
    //   if (this.pageName != '') {
    //     this.getInfoPage();
    //   }
    // });

  }

  getInfoPage() {
    this.loading.presentLoading();
    this.userService.getInfoPages()
      .subscribe((response) => {
        console.log(response);
        switch (this.pageName) {
          case 'privacy':
            this.pageContent = response['data'].policy;
            break;
          case 'terms':
            this.pageContent = response['data'].tearms;
            break;
          case 'about_us':
            this.pageContent = response['data'].aboutUs;
            break;
          default:
            break;
        }
        this.loading.dismiss();
      }, (error) => {
        this.loading.dismiss();
        this.events.publish('Request:Error', error);
        console.log('error get Info page', error);
      });

    console.log("page name:", this.pageName);
    console.log("page content:", this.pageContent);
  }

}
