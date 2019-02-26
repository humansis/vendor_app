import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ProductsPage } from '../pages/products/products';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      this.storage.get('vendor').then(vendor => {
        if(vendor) {
          this.rootPage = ProductsPage;
        } else {
          this.rootPage = LoginPage;
        }
      })
      splashScreen.hide();
    });
  }
}

