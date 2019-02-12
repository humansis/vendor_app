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
  scanDisabled: boolean = false;

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

    let scannedCodeInfo = scannedCode.match(/^([A-Z]+)(\d+)#([\d]..-[\d]..-[\d]..)-([\da-z]+)$/i)

    if (scannedCodeInfo === null) {
      this.errorMessage = 'Your code isn\'t the right format, are you sure it is a BMS Voucher ?'
    }

    let previousBooklet = this.vouchers.length ? this.vouchers[0].booklet : null
    previousBooklet = '096-098-097' // to delete after
    let newBooklet = scannedCodeInfo[3]

    if (previousBooklet && previousBooklet !== newBooklet) {
      this.openDifferentBookletModal()
      return
    }
    
    this.vouchers.push({
      id: scannedCodeInfo[4],
      qrCode: scannedCode,
      vendorId: this.vendor.id,
      productIds: this.productIds,
      price: this.price$.getValue(),
      currency: scannedCodeInfo[1],
      value: parseInt(scannedCodeInfo[2]),
      booklet: scannedCodeInfo[3]
    })
    let scannedCodeValue = scannedCodeInfo[2]
    this.vouchersTotalValue += parseInt(scannedCodeValue)

    if (this.vouchersTotalValue >= this.price$.getValue()) {
      let productsList = ""
      this.products$.getValue().forEach(product => {
        productsList += product.quantity + " " + product.name + ", "
      })
      let vouchersList = ""
      this.vouchers.forEach(voucher => {
        vouchersList += '-' + voucher.qrCode + " : " + voucher.value + " " + voucher.currency + `<br>`
      })
      this.errorMessage = ""
      this.successMessage = "You have scanned sufficient vouchers. You can now complete the transaction of " +
      productsList + "for a total of " + this.price$.getValue() +
      " using " + this.vouchers.length + " voucher(s) : " + `<br>` + vouchersList
      if (this.vouchersTotalValue > this.price$.getValue()) {
        this.successMessage += `You still have ` + (this.vouchersTotalValue - this.price$.getValue()) + scannedCodeInfo[1] + ` available on your vouchers.
          However, they will be considered fully used and cannot be used again. If you would like to add
         further items to your basket, you can go back now and add them, but you will need to scan your vouchers again.`
      }
    } else {
      this.successMessage = ''
      this.errorMessage = 'Your vouchers (' + this.vouchersTotalValue + scannedCodeInfo[1] +
        ') are not high enough to pay ' + this.price$.getValue() + '.' +
        `<br> Please scann another one`
    }
  }

  ngOnInit() {
    this.price$ = this.voucherProvider.getPrice()
    this.products$ = this.voucherProvider.getProducts()
    this.price$.subscribe(price => { console.log(price)})
    this.products$.subscribe(products => { 
      if (products.length <= 0) {
        this.scanDisabled = true
        this.errorMessage = 'You haven\'t selected any product, please go back to the previous page.'
      }
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
