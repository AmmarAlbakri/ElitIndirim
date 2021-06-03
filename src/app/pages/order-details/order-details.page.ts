import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  order;

  constructor(private route: ActivatedRoute, private router: Router,
    private loading: LoadingService,
    private translateService: TranslateService) {
    this.route.queryParams.subscribe(params => {
      this.order = this.router.getCurrentNavigation().extras.state.order;
      console.log(this.order);
      this.loading.loading.dismiss();
    });

  }


  ngOnInit() {
  }

  showContractDetails(pageName = '', content) {
    if (pageName != '') {
      pageName = this.translateService.instant(pageName);
      this.router.navigate(['tabs/profile/info', { pageName, content }]);
    }
  }
}
