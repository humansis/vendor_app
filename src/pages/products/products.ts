import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScanPage } from '../scan/scan';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  public products: any = [
    {
      'name': 'soap',
      'image': 'https://blabla/imgs/soap.png',
      'unit': 'USD'
    },
    {
      'name': 'toothbrush',
      'image': 'https://blabla/imgs/toothbrush.png',
      'unit': 'USD'
    },
    {
      'name': 'peers',
      'image': 'https://blabla/imgs/peers.png',
      'unit': 'USD'
    },
    {
      'name': 'rice',
      'image': 'https://blabla/imgs/rice.png',
      'unit': 'USD'
    },
    {
      'name': 'flour',
      'image': 'https://blabla/imgs/flour.png',
      'unit': 'USD'
    },
    {
      'name': 'toothpaste',
      'image': 'https://blabla/imgs/toothpaste.png',
      'unit': 'USD'
    },
    {
      'name': 'soap',
      'image': 'https://blabla/imgs/soap.png',
      'unit': 'USD'
    },
    {
      'name': 'toothbrush',
      'image': 'https://blabla/imgs/toothbrush.png',
      'unit': 'USD'
    },
    {
      'name': 'peers',
      'image': 'https://blabla/imgs/peers.png',
      'unit': 'USD'
    },
    {
      'name': 'rice',
      'image': 'https://blabla/imgs/rice.png',
      'unit': 'USD'
    },
    {
      'name': 'flour',
      'image': 'https://blabla/imgs/flour.png',
      'unit': 'USD'
    }
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }

  goToScanPage(){
    this.navCtrl.push(ScanPage);
  }
}
