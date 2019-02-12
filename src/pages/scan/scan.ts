import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Vendor } from '../../model/vendor'
import { Storage } from '@ionic/storage';
import { Voucher } from '../../model/voucher';
import { Product } from '../../model/product'
import { ProductsPage } from '../products/products';
import { ModalPage } from '../modal/modal';


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
  vouchers: Array<Voucher> = [];
  vouchersTotalValue: number = 0;
  price$: BehaviorSubject<number>;
  products$: BehaviorSubject<Product[]>;
  errorMessage: string = '';
  successMessage: string = '';
  vendor: Vendor;
  productIds: number[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public voucherProvider: VoucherProvider,
    private storage: Storage,
    public modalController: ModalController) 
  {
  }

  scanCode() {
    let scannedCode = ''
    this.barcodeScanner.scan().then(barcodeData => {
      scannedCode = barcodeData.text
      // all the logic can be moved in here when the scan can be tested
    })
    // meanwhile...
    scannedCode = 'USD140#096-098-097-2d8b4' // to delete after

    let scannedCodeInfo = scannedCode.match(/^[A-Z]+(\d+)#([\d]..-[\d]..-[\d]..)-([\da-z]+)$/i)

    console.log(scannedCodeInfo)

    let previousScannedCode = this.vouchers.length ? this.vouchers[0].qrCode : null
    previousScannedCode = 'USD140#096-098-097-2d544' // to delete after

    let previousScannedCodeInfo = previousScannedCode ?
      previousScannedCode.match(/^[A-Z]+(\d+)#([\d]..-[\d]..-[\d]..)-[\da-z]+$/i) :
      null
    
    let previousBooklet = previousScannedCodeInfo ? previousScannedCodeInfo[2] : null
    let newBooklet = scannedCodeInfo[2]

    if (previousBooklet && previousBooklet !== newBooklet) {
      this.openDifferentBookletModal()
      return
    }
    
    this.vouchers.push({
      qrCode: scannedCode,
      vendorId: this.vendor.id,
      productIds: this.productIds,
      price: this.price$.getValue()
    })
    let scannedCodeValue = scannedCodeInfo[1]
    this.vouchersTotalValue += parseInt(scannedCodeValue)

    if (this.vouchersTotalValue >= this.price$.getValue()) {
      let productsList = ''
      this.products$.getValue().forEach(product => {
        productsList += product.quantity + ' ' + product.name + ', '
      })
      this.errorMessage = ''
      this.successMessage = 'You scanned enough vouchers for this transaction. You can now complete the transaction to buy ' +
      productsList + 'for a total amount of ' + this.price$.getValue() +
      ' with ' + this.vouchers.length + ' voucher(s) of a total value of ' + this.vouchersTotalValue + '.'
      if (this.vouchersTotalValue > this.price$.getValue()) {
        this.successMessage += '\n Don\'t forget that after this transaction, the vouchers will be considered as used ' + 
        'even if they are higher than the amount you\'re spending. You can go back to the product list to complete it up ' + 
        'to the vouchers\' value. If you do that, then your vouchers won\'t be considered used and you will have to scan them again'
      }
    } else {
      this.successMessage = ''
      this.errorMessage = 'Your vouchers (' + this.vouchersTotalValue +
        ') are not high enough to pay ' + this.price$.getValue() +
        ', please scann another one'
    }
  }

  ngOnInit() {
    this.price$ = this.voucherProvider.getPrice()
    this.products$ = this.voucherProvider.getProducts()
    this.price$.subscribe(price => { console.log(price)})
    this.products$.subscribe(products => { 
      products.forEach(product => {
        this.productIds.push(product.id)
      })
      console.log(products)
    })
    this.storage.get('vendor').then(vendor => {
      this.vendor = vendor
    })
  }

  completeTransaction() {
      this.voucherProvider.scanVouchers(this.vouchers)
    this.navCtrl.push(ProductsPage);
  }

  cancelTransaction() {
    this.vouchers = []
    this.vouchersTotalValue = 0;
    this.voucherProvider.setPrice(null)
    this.voucherProvider.setProducts([])
    this.navCtrl.push(ProductsPage);
  }

  async openProceedModal() {
    let okMessage = 'Proceed and go back to the product page'
    const modal = await this.modalController.create(ModalPage, {
      title: 'Proceed transaction',
      message: 'Are you sure you want to proceed with this transaction ?' +
      ' Your vouchers will be considered as used and kept by the vendor.',
      okButton: okMessage,
      cancelButton: 'Go back to the scan page'
    });
    modal.onDidDismiss(data =>{
      if(data === okMessage) { 
        this.completeTransaction()
      }
    })
    return await modal.present();
  }

  async openCancelModal() {
    let okMessage = 'Cancel transaction and go back to the product page'
    const modal = await this.modalController.create(ModalPage, {
      title: 'Cancel transaction',
      message: 'Are you sure you want to cancel this transaction ?' +
      ' Your vouchers won\'t be considered as used and your products list will empty.',
      okButton: okMessage,
      cancelButton: 'Go back to the scan page'
    });
    modal.onDidDismiss(data =>{
      if(data === okMessage) { 
        this.cancelTransaction()
      }
    })
    return await modal.present();
  }

  async openDifferentBookletModal() {
    let okMessage = 'Cancel transaction and go back to the product page'
    const modal = await this.modalController.create(ModalPage, {
      title: 'Vouchers from a different booklet',
      message: 'You now are using the booklet of another beneficiary.' +
      ' Are you sure you want to end the previous transaction and move on to a new one?' +
      ' Your previous vouchers won\'t be considered as used and your products list will empty.',
      okButton: okMessage,
      cancelButton: 'Go back to the scan page'
    });
    modal.onDidDismiss(data =>{
      if(data === okMessage) { 
        this.cancelTransaction()
      }
    })
    return await modal.present();
  }
}
