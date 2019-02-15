import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

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
        private storage: Storage) {
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
			if (vouchers == null || vouchers.length === 0) {
				this.successMessage = 'Your are already up to date'
				setTimeout(() => { this.successMessage = '' }, 30000);
			} else {
				// Send the vouchers to the back
				this.storage.set('vouchers', [])
				this.successMessage = 'Data has been synced'
				setTimeout(() => { this.successMessage = '' }, 3000);
			}
		})
	}

}
