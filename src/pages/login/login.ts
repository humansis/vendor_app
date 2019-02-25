import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vendor } from '../../model/vendor'
import { GlobalText } from '../../texts/global';
import { ProductsPage } from '../products/products';
import { LoginProvider } from '../../providers/login/login';
import { AlertController } from 'ionic-angular';
import { SyncProvider } from '../../providers/sync/sync';
import { environment } from '../../environments/environment';

@Component({
  selector: 'page-login',
  templateUrl: './login.html'
})
export class LoginPage {

  public login = GlobalText.TEXTS;
  public vendor: Vendor;
  public loader: boolean = false;
  public version: string = environment.VERSION;

  constructor(
    public navCtrl: NavController,
    public loginProvider: LoginProvider,
    private alertCtrl: AlertController,
    private syncProvider: SyncProvider) {
  }

  ngOnInit() {
    this.blankUser();
}

clickSubmit() {
  this.loader = true;
  this.loginProvider.login(this.vendor).then((vendor) => {
    this.syncProvider.getDeactivatedBooklets().then(success => {
      this.navCtrl.setRoot(ProductsPage);
    }), error => {
      this.loader = false;
      let alert = this.alertCtrl.create({
        title: 'Login failed',
        subTitle: 'There was a connection problem, please verify your connection and try again',
        buttons: ['OK']
        });
      alert.present();
    }
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
