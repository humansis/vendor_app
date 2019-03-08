import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ProductsPage } from '../pages/products/products';
import { Storage } from '@ionic/storage';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private storage: Storage,
        private androidFullScreen: AndroidFullScreen
    ) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            this.storage.get('vendor').then(vendor => {
                if (vendor) {
                    this.rootPage = ProductsPage;
                } else {
                    this.rootPage = LoginPage;
                }
                splashScreen.hide();
                // this.androidFullScreen.isImmersiveModeSupported()
                // .then(() => this.androidFullScreen.immersiveMode().then()) // Android 4.4+ only
                // .catch();
            });
        });
    }
}

