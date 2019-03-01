import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import CryptoJS from 'crypto-js';

@Component({
    selector: 'form-modal',
    templateUrl: 'form-modal.html'
})
export class FormModal implements OnInit {

    constructor(public viewCtrl: ViewController, public navParams: NavParams) { }

    public title = '';
    public message = '';
    public okButton = '';
    public cancelButton = '';
    public typedPassword: string;
    public expectedSaltedPasswords: string[];
    public tries: number;
    public triesMessage: string;

    /**
     * Close modal
     */
    public closeModal() {
        this.viewCtrl.dismiss(this.cancelButton);
    }

    /**
     * Accept modal and close
     */
    public accept() {
        if (this.typedPassword && this.expectedSaltedPasswords.includes(this.salt(this.typedPassword))) {
            this.viewCtrl.dismiss(this.okButton);
        } else {
            this.tries -= 1;
            if (this.tries === 0) {
                this.viewCtrl.dismiss(null);
            }
            this.triesMessage = 'You didn\'t type the right password. You have only ' +
                this.tries + ' tries left.';
        }
    }

    /**
     * Salt password
     * @param  password
     */
    public salt(password: string): string {
        return CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64);
    }

    /**
     * Method executed on component creation
     */
    ngOnInit() {
        this.title = this.navParams.get('title');
        this.message = this.navParams.get('message');
        this.okButton = this.navParams.get('okButton');
        this.cancelButton = this.navParams.get('cancelButton');
        this.expectedSaltedPasswords = this.navParams.get('saltedPasswords');
        this.triesMessage = this.navParams.get('triesMessage');
        this.tries = this.navParams.get('tries');
    }

}
