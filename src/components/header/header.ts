import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { SyncProvider } from '../../providers/sync/sync';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@Component({
    selector: 'header',
    templateUrl: 'header.html'
})
export class HeaderComponent {

    @Input() title: string;

    loading: any;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private syncProvider: SyncProvider,
        private alertCtrl: AlertController,
        public loadingController: LoadingController) {
    }

    /**
     * Logout user
     */
    logout() {
        this.storage.get('vouchers').then(vouchers => {
            if (vouchers !== null && vouchers.length > 0) {
                const alert = this.alertCtrl.create({
                    title: 'Logout',
                    subTitle: 'You need to sync your data before loging out',
                    buttons: ['OK']
                });
                alert.present();
            } else {
                this.storage.set('vendor', null);
                this.navCtrl.setRoot(LoginPage);
            }
        });
    }

    /**
     * Sync vouchers with backend
     */
    sync() {
        this.presentLoading();
        this.storage.get('vouchers').then(vouchers => {
            this.storage.get('deactivatedBooklets').then(booklets => {
                if (!vouchers) {
                    vouchers = [];
                }
                this.syncProvider.sync(vouchers, booklets).then(success => {
                    this.storage.set('vouchers', []);
                    this.loading.dismiss();
                    const alert = this.alertCtrl.create({
                        title: 'Sync',
                        subTitle: 'Data has been successfully sync',
                        buttons: ['OK']
                    });
                    alert.present();
                }, error => {
                    this.loading.dismiss();
                    const alert = this.alertCtrl.create({
                        title: 'Sync',
                        subTitle: 'We were not able to sync you data, please verify your internet connection and retry.',
                        buttons: ['OK']
                    });
                    alert.present();
                });
            });
        });
    }

    /**
     * Show loading information
     */
    async presentLoading() {
        this.loading = await this.loadingController.create({
            spinner: 'crescent',
            content: '<div>Please wait...</div>'
        });
        return await this.loading.present();
    }
}
