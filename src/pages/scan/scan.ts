import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VoucherProvider } from '../../providers/voucher/voucher';

/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  // qrData: any = null;
  // createdCode: any = null;
  scannedCode: any = null;
  price$: BehaviorSubject<number>;
  productIds$: BehaviorSubject<number[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public voucherProvider: VoucherProvider) 
  {
  }

  // createCode() {
  //   this.createdCode = this.qrData;
  // }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text
    })
  }

  ngOnInit() {
    this.price$ = this.voucherProvider.getPrice()
    this.productIds$ = this.voucherProvider.getProductIds()
    this.price$.subscribe(price => { console.log(price)})
    this.productIds$.subscribe(productIds => { console.log(productIds)})

  }
}
