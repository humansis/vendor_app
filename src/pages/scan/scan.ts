import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { LoginProvider } from '../../providers/login/login'
import { Vendor } from '../../model/vendor'
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
  vendor$: BehaviorSubject<Vendor>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public voucherProvider: VoucherProvider,
    public loginProvider: LoginProvider) 
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
    if (scannedCodeValue > this.price$.getValue()) {
      this.voucherProvider.scanCode({
        qrCode: this.scannedCode,
        vendorId: this.vendor$.getValue().id,
        productIds: this.productIds$.getValue(),
        price: this.price$.getValue()
      })
    } else {
      console.log('the price is higher than the voucher value')
    }
  }

  ngOnInit() {
    this.price$ = this.voucherProvider.getPrice()
    this.productIds$ = this.voucherProvider.getProductIds()
    this.vendor$ = this.loginProvider.getVendor()
    this.price$.subscribe(price => { console.log(price)})
    this.productIds$.subscribe(productIds => { console.log(productIds)})
    this.vendor$.subscribe(vendor => console.log(vendor))

  }
}
