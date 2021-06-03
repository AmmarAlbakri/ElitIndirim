import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-return-details',
  templateUrl: './return-details.page.html',
  styleUrls: ['./return-details.page.scss'],
})
export class ReturnDetailsPage implements OnInit {


  order;

  constructor(private route: ActivatedRoute, private orderService: OrderService, private router: Router,
    private loading: LoadingService) {
    this.route.queryParams.subscribe(params => {
      this.order = this.router.getCurrentNavigation().extras.state.order;
      console.log(this.order);
    });
  }


  ngOnInit() {
  }

}
