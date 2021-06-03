import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.page.html',
  styleUrls: ['./image-model.page.scss'],
})
export class ImageModelPage implements OnInit {

  img: any;

  @ViewChild('slider', { read: ElementRef, static: true }) slider: ElementRef;

  sliderOpts = {
    zoom: {
      maxRatio: 5
    },
    centeredSlides: true
  };
  constructor(private navParams: NavParams,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.img = this.navParams.get('img');
  }

  zoom(zoomIn: boolean) {
    let zoom = this.slider.nativeElement.swiper.zoom;

    if (zoomIn) {
      zoom.in();
    }
    else {
      zoom.out();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
