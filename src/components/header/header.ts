import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { SyncProvider } from '../../providers/sync/sync';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'header',
	templateUrl: 'header.html'
})
export class HeaderComponent {

	@Input() title: string;

	constructor(
        public navCtrl: NavController,
		private storage: Storage,
		private syncProvider: SyncProvider,
		private alertCtrl: AlertController) {
	}

	logout() {
		this.storage.get('vouchers').then(vouchers => {
			if (vouchers !== null && vouchers.length > 0) {
				let alert = this.alertCtrl.create({
					title: 'Logout',
					subTitle: 'You need to sync your data before loging out',
					buttons: ['OK']
				  });
				alert.present();
			} else {
				this.storage.set('vendor', null)
				this.navCtrl.setRoot(LoginPage);
			}
		})
	}

	sync() {
		this.storage.get('vouchers').then(vouchers => {
			this.storage.get('deactivatedBooklets').then(booklets => {
					this.syncProvider.sync(vouchers, booklets).then(deactivatedBooklets => {
						this.storage.set('vouchers', [])
						let deactivatedBookletIds = []
						console.log(deactivatedBooklets)
						deactivatedBooklets.forEach(booklet => {
							deactivatedBookletIds.push(booklet['id'])
						})
						this.storage.set('deactivatedBooklets', deactivatedBookletIds)
						let alert = this.alertCtrl.create({
							title: 'Sync',
							subTitle: 'Data has been successfully sync',
							buttons: ['OK']
						  });
						alert.present();
					}, error => {
						let alert = this.alertCtrl.create({
							title: 'Sync',
							subTitle: 'We were not able to sync you data, please verify your internet connection and retry.',
							buttons: ['OK']
						  });
						alert.present();
					})
			})
		})
	}
}
