import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GlobalText } from '../../texts/global';

@Component({
  selector: 'page-login',
  templateUrl: './login.html'
})
export class LoginPage {

  public login = GlobalText.TEXTS;
  public vendor = {username: '', password: ''}

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    // GlobalText.resetMenuMargin();
}

clickSubmit() {
  console.log(this.vendor)
}

}
