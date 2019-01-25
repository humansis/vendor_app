import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Vendor } from '../../model/vendor'
import { GlobalText } from '../../texts/global';

// Pages
import { ProductsPage } from '../products/products';

// Plugins

@Component({
  selector: 'page-login',
  templateUrl: './login.html'
})
export class LoginPage {

  public login = GlobalText.TEXTS;
  public vendor: Vendor;

  constructor(
    public navCtrl: NavController) {

  }

  ngOnInit() {
    // GlobalText.resetMenuMargin();
    this.blankUser();
}

clickSubmit() {
  this.navCtrl.setRoot(ProductsPage);
}

blankUser() {
  this.vendor = new Vendor();
  this.vendor.username = '';
  this.vendor.password = '';
}

}
