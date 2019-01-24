import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Vendor } from '../../model/vendor'
import { GlobalText } from '../../texts/global';

@Component({
  selector: 'page-login',
  templateUrl: './login.html'
})
export class LoginPage {

  public login = GlobalText.TEXTS;
  public vendor: Vendor;

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    // GlobalText.resetMenuMargin();
    this.blankUser();
}

clickSubmit() {
  console.log(this.vendor)
}

blankUser() {
  this.vendor = new Vendor();
  this.vendor.username = '';
  this.vendor.password = '';
}

}
