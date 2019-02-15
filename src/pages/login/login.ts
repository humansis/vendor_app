import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vendor } from '../../model/vendor'
import { GlobalText } from '../../texts/global';
import { ProductsPage } from '../products/products';
import { LoginProvider } from '../../providers/login/login';
import { AlertController } from 'ionic-angular';

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
    public loginProvider: LoginProvider,
    private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.blankUser();
}

clickSubmit() {
  this.loader = true;
  this.loginProvider.login(this.vendor).then((vendor) => {
    this.navCtrl.setRoot(ProductsPage);
  }, error => {
    this.loader = false;
    let alert = this.alertCtrl.create({
      title: 'Login failed',
      subTitle: error,
      buttons: ['OK']
      });
    alert.present();
  })
}

blankUser() {
  this.vendor = new Vendor();
  this.vendor.username = '';
  this.vendor.password = '';
}

}
