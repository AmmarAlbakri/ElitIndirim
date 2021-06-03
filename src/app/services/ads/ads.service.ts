import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private api: ApiService) { }

  getAllAds() {
    return this.api.get(`/ads`);
  }

  getAllSliders() {
    return this.api.get('/ads/user/getAllAdsForHomePage');
  }

  getAdsForCategory(catID, min, max,pageNum) {
    return this.api.get(`/ads/user/ads?category=${catID}&min=${min}&max=${max}&page=${pageNum}`);
  }
}
