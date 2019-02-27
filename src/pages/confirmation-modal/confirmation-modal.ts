import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'confirmation-modal',
    templateUrl: 'confirmation-modal.html'
})
export class ConfirmationModal implements OnInit {

    constructor(public viewCtrl: ViewController, public navParams: NavParams) { }

    public title = '';
    public message = '';
    public okButton = '';
    public cancelButton = '';

    /**
     * Close modal
     */
    public closeModal() {
        this.viewCtrl.dismiss(null);
    }

    /**
     * Accept modal and close
     */
    public accept() {
        this.viewCtrl.dismiss(this.okButton);
    }

    /**
     * Method executed on component creation
     */
    ngOnInit() {
        this.title = this.navParams.get('title');
        this.message = this.navParams.get('message');
        this.okButton = this.navParams.get('okButton');
        this.cancelButton = this.navParams.get('cancelButton');
    }

}
