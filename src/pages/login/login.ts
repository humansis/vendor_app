import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Vendor } from '../../model/vendor'
import { GlobalText } from '../../texts/global';

// Pages
import { ProductsPage } from '../products/products';
import { LoginProvider } from '../../providers/login/login';

// Plugins

@Component({
  selector: 'page-login',
  templateUrl: './login.html'
})
export class LoginPage {

  public login = GlobalText.TEXTS;
  public vendor: Vendor;
  public loader: boolean = false;

  constructor(
    public navCtrl: NavController,
    public loginProvider: LoginProvider) {

  }

  ngOnInit() {
    // GlobalText.resetMenuMargin();
    this.blankUser();
}

clickSubmit() {
  this.loader = true;
  this.loginProvider.login(this.vendor).then((vendor) => {
    this.navCtrl.setRoot(ProductsPage);
  }, error => {
    this.loader = false;
    console.log(error)
  })
}

blankUser() {
  this.vendor = new Vendor();
  this.vendor.username = '';
  this.vendor.password = '';
}

}
