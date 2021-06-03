import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from '../services/globals/globals.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private router: Router,
    public globalsService: GlobalsService) { }

  goToPage(page) {
    this.router.navigate([page]);
  }

}
