import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { SyncProvider } from '../../providers/sync/sync'

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
    public errorMessage: string = '';
    public successMessage: string = '';

	constructor(
        public navCtrl: NavController,
		private storage: Storage,
		private syncProvider: SyncProvider) {
	}

	logout() {
		this.storage.get('vouchers').then(vouchers => {
			if (vouchers !== null && vouchers.length > 0) {
				this.errorMessage = 'You need to sync your data before loging out'
				setTimeout(() => { this.errorMessage = '' }, 3000);
			} else {
				this.storage.set('vendor', null)
				this.navCtrl.setRoot(LoginPage);
			}
		})
	}

	sync() {
		this.storage.get('vouchers').then(vouchers => {
			this.storage.get('deactivatedBooklets').then(booklets => {
				if ((vouchers == null || vouchers.length === 0) && (booklets === null || booklets.length === 0) ) {
					this.successMessage = 'Your are already up to date'
					setTimeout(() => { this.successMessage = '' }, 30000);
				} else {
					this.syncProvider.sync(vouchers, booklets).then(success => {
						this.storage.set('vouchers', [])
						this.successMessage = 'Data has been synced'
						setTimeout(() => { this.successMessage = '' }, 3000);
					}, error => {
						this.errorMessage = 'We were not able to sync you data, please verify your internet connection and retry.'
					})
					
				}
			})
		})
	}
}
