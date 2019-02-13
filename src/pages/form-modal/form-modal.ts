import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'form-modal',
  templateUrl: 'form-modal.html'
})
export class FormModal {

  constructor(public viewCtrl : ViewController, public navParams: NavParams) {}
  
  public title: string = '';
  public message: string = '';
  public okButton: string = '';
  public cancelButton: string = '';
  public typedPassword: string;
  public expectedSaltedPassword: string;
  public tries: number;
  public triesMessage: string;


  public closeModal(){
    this.viewCtrl.dismiss(this.cancelButton);
  }

  public accept() {
    if (this.typedPassword && this.salt(this.typedPassword) === this.expectedSaltedPassword) {
      this.viewCtrl.dismiss(this.okButton)
    }
    else {
      this.tries -= 1
      if (this.tries === 0) {
        this.viewCtrl.dismiss(null)
      }
      this.triesMessage = 'You didn\'t type the right password. You have only ' +
        this.tries + ' tries left.'
    }
  }

  public salt(password: string) : string {
    return CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64)
  }

  ngOnInit() { 
      this.title = this.navParams.get('title')
      this.message = this.navParams.get('message')
      this.okButton = this.navParams.get('okButton')
      this.cancelButton = this.navParams.get('cancelButton')
      this.expectedSaltedPassword = this.navParams.get('saltedPassword')
      this.triesMessage = this.navParams.get('triesMessage')
      this.tries = this.navParams.get('tries')
  }

}
