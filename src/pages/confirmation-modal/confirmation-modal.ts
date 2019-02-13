import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'confirmation-modal',
  templateUrl: 'confirmation-modal.html'
})
export class ConfirmationModal {

  constructor(public viewCtrl : ViewController, public navParams: NavParams) {}
  
  public title: string = '';
  public message: string = '';
  public okButton: string = '';
  public cancelButton: string = '';


  public closeModal(){
    this.viewCtrl.dismiss(null);
  }

  public accept() {
    this.viewCtrl.dismiss(this.okButton)
  }

  ngOnInit() { 
      this.title = this.navParams.get('title')
      this.message = this.navParams.get('message')
      this.okButton = this.navParams.get('okButton')
      this.cancelButton = this.navParams.get('cancelButton')
  }

}
