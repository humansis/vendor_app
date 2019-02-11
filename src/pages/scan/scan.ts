import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Vendor } from '../../model/vendor'
import { Storage } from '@ionic/storage';

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
    public voucherProvider: VoucherProvider,
    private storage: Storage) 
  {
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text
    })
    this.scannedCode = 'USD140#12342104'
    let scannedCodeValue = this.scannedCode.match(/^[A-Z]+(\d+)#\d+$/i)[1]
    // console.log(this.scannedCode)
    // console.log(scannedCodeValue)
    let vendor
    this.storage.get('vendor').then(val => {
      vendor = val
      if (scannedCodeValue > this.price$.getValue()) {
        this.voucherProvider.scanCode({
          qrCode: this.scannedCode,
          // vendorId: this.vendor$.getValue().id,
          vendorId: vendor.id,
          productIds: this.productIds$.getValue(),
          price: this.price$.getValue()
        })
      } else {
        console.log('the price is higher than the voucher value')
      }
    })
  }

  ngOnInit() {
    this.price$ = this.voucherProvider.getPrice()
    this.productIds$ = this.voucherProvider.getProductIds()
    this.price$.subscribe(price => { console.log(price)})
    this.productIds$.subscribe(productIds => { console.log(productIds)})
  }
}
