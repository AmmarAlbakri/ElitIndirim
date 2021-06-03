import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-contracts',
  templateUrl: './order-contracts.page.html',
  styleUrls: ['./order-contracts.page.scss'],
})
export class OrderContractsPage implements OnInit {

  public contractType = '';
  public contracts;
  public selectedIndex;
  public panelOpenState = true;

  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.contractType = this.router.getCurrentNavigation().extras.state.contractType;
        this.contracts = this.router.getCurrentNavigation().extras.state.contracts;
      }
    });
  }

  ngOnInit() {

  }

  toggle(i) {
    if (this.selectedIndex == i) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = i;
    }
  }

}
