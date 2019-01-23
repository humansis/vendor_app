import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Pages
import { ScanPage } from '../scan/scan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goScanPage() {
    this.navCtrl.setRoot(ScanPage);
  }
}
