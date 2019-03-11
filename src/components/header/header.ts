import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { SyncProvider } from '../../providers/sync/sync';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

@Component({
    selector: 'header',
    templateUrl: 'header.html'
})
export class HeaderComponent {

    @Input() title: string;

    loading: any;
    visibleOnline = false;
    turnButton = false;
    disabledSync = false;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private syncProvider: SyncProvider,
        private alertCtrl: AlertController,
        public loadingController: LoadingController,
        private network: Network) {
    }

    // If we get wifi for the first time of the day we sync
    connectSubscription = this.network.onConnect().subscribe(() => {
        this.storage.get('date').then(date => {
            if (date !== new Date().toDateString()) {
                this.sync(false);
            }
        });
    });

    /**
     * If we use the app for the first time of the day and we have wifi we sync
     */
    ngOnInit() {
        this.storage.get('date').then(date => {
            if (date !== new Date().toDateString()) {
                this.sync(false);
            }
        });
    }

    /**
     * Log out
     */
    logout() {
        this.storage.set('vendor', null);
        this.navCtrl.setRoot(LoginPage);
    }

    /**
     * Sync vouchers with backend, automatically or manually
     */
    sync(manual: boolean) {
        this.disabledSync = true;
        this.syncingAnimation();
        this.storage.get('vouchers').then(vouchers => {
            this.storage.get('deactivatedBooklets').then(booklets => {
                if (!vouchers) {
                    vouchers = [];
                }
                this.syncProvider.sync(vouchers, booklets).then(success => {
                    this.storage.set('vouchers', []);
                    const date = new Date().toDateString();
                    this.storage.set('date', date);
                    this.disabledSync = false;
                    if (manual) {
                        const alert = this.alertCtrl.create({
                            title: 'Sync',
                            subTitle: 'Data has been successfully sync',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                }, error => {
                    this.disabledSync = false;
                    if (manual) {
                        const alert = this.alertCtrl.create({
                            title: 'Sync',
                            subTitle: 'We were not able to sync you data, please verify your internet connection and retry.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                });
            });
        });
    }

    /**
     * Animation while the app is syncing
     */
    syncingAnimation() {
        this.turnButton = true;
        setTimeout(() => {
            this.visibleOnline = true;
        }, 800);
        setTimeout(() => {
            this.visibleOnline = false;
            this.turnButton = false;
        }, 2300);
    }
}
