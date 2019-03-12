import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { LoginPage } from '../pages/login/login';
import { ProductsPage } from '../pages/products/products';
import { Storage } from '@ionic/storage';

@Component({
    templateUrl: 'app.html'
})
export class MyApp implements OnInit {
    rootPage: any;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private androidFullScreen: AndroidFullScreen,
        private storage: Storage
    ) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            androidFullScreen.isImmersiveModeSupported()
                .then(() => {
                    androidFullScreen.immersiveMode();
                });
            this.storage.get('vendor').then(vendor => {
                if (vendor) {
                    this.rootPage = ProductsPage;
                } else {
                    this.rootPage = LoginPage;
                }
                splashScreen.hide();
            });
        });
    }

    /**
     * Method executed on component creation
     */
    ngOnInit() {
        window.addEventListener('keyboardWillShow', (event) => {
            this.androidFullScreen.showSystemUI();
        });
        window.addEventListener('keyboardDidHide', () => {
            this.androidFullScreen.immersiveMode();
        });

        const screenHeight = window.screen.height;
        document.documentElement.style.setProperty('--screenHeight', `${screenHeight}px`);
    }
}

