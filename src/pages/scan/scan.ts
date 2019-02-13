import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Vendor } from '../../model/vendor'
import { Storage } from '@ionic/storage';
import { Voucher } from '../../model/voucher';
import { Product } from '../../model/product'
import { ProductsPage } from '../products/products';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';
import { FormModal } from '../form-modal/form-modal';


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

  ngOnInit() {
    this.price$ = this.voucherProvider.getPrice()
    this.products$ = this.voucherProvider.getProducts()
    this.price$.subscribe(price => {})
    this.products$.subscribe(products => { 
      if (products.length <= 0) {
        this.scanDisabled = true
        this.errorMessage = 'You haven\'t selected any product, please go back to the previous page.'
      }
      products.forEach(product => {
        this.productIds.push(product.id)
      })
    })
    this.storage.get('vendor').then(vendor => {
      this.vendor = vendor
    })
  }

  scanCode() {
    let scannedCode = ''
    this.successMessage = ''
    this.errorMessage = ''
    this.barcodeScanner.scan().then(barcodeData => {
      scannedCode = barcodeData.text
      // all the logic can be moved in here when the scan can be tested
    })
    // meanwhile... (to test, the encoded password is 'secret-password')
    scannedCode = 'USD140#096-098-097-2d8b4-avPBIe1KdSk2wpfN37ewA5TqvxA=' // to delete after

    if (this.ifHasNoPasswordGetInfo(scannedCode)) {
      this.handleScannedCode(scannedCode, this.ifHasNoPasswordGetInfo(scannedCode))
    }
  }

  ifHasNoPasswordGetInfo(scannedCode : string) : string[] {
    let scannedCodeInfo = scannedCode.match(/^([A-Z]+)(\d+)#([\d]..-[\d]..-[\d]..)-([\da-z]+)-([\da-z=]+)$/i)
    if (scannedCodeInfo !== null) {
      this.openPasswordModal(scannedCode, scannedCodeInfo)
    } else {
      scannedCodeInfo = scannedCode.match(/^([A-Z]+)(\d+)#([\d]..-[\d]..-[\d]..)-([\da-z]+)$/i)
      return scannedCodeInfo
    }
  }

  openPasswordModal(scannedCode : string, scannedCodeInfo : string[]) {
    let okMessage = 'Submit'
    let cancelButton = 'Go back to the scan page'
    const modal = this.modalController.create(FormModal, {
      title: 'Password',
      message: 'Please enter the voucher\'s password',
      okButton: okMessage,
      cancelButton: cancelButton,
      saltedPassword: scannedCodeInfo[5],
      triesMessage: 'Be aware that you have only three tries before your booklet deactivates.',
      tries: 3
    });

    modal.onDidDismiss(data => {
      if(data === okMessage) {
        this.handleScannedCode(scannedCode, scannedCodeInfo)
      } else if (data === cancelButton) {
        return
      } else {
        this.storage.get("deactivatedBooklets").then(cacheBooklets => {
          let alreadyStoredBooklets = cacheBooklets || [];
          alreadyStoredBooklets.push(scannedCodeInfo[3])
          this.storage.set("deactivatedBooklets", alreadyStoredBooklets)
        });
        this.errorMessage = 'You have exceeded your tries at password, your booklet will be deactivated'
        return
      }
    })
    modal.present();
  }

  handleScannedCode (scannedCode : string, scannedCodeInfo : string[]) {
      if (scannedCodeInfo === null) {
        this.errorMessage = 'Your code isn\'t the right format, are you sure it is a BMS Voucher ?'
      }
      let previousBooklet = this.vouchers.length ? this.vouchers[0].booklet : null
      previousBooklet = '096-098-097' // to delete after
      let newBooklet = scannedCodeInfo[3]

      this.storage.get("deactivatedBooklets").then(deactivatedBooklets => {
        if (deactivatedBooklets && deactivatedBooklets.includes(newBooklet)) {
          this.errorMessage = 'You cannot use this booklet because it has previously been deactivated.'
          return
        }
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
          this.setMessageSuccess(scannedCodeInfo[1])
        } else {
          this.errorMessage = 'Your vouchers (' + this.vouchersTotalValue + scannedCodeInfo[1] +
            ') are not high enough to pay ' + this.price$.getValue() + '.' +
            `<br> Please scann another one`
        }
      })
  }

  setMessageSuccess(currency : string) {
    let productsList = ""
      this.products$.getValue().forEach(product => {
        productsList += product.quantity + " " + product.name + ", "
      })
      let vouchersList = ""
      this.vouchers.forEach(voucher => {
        vouchersList += '-' + voucher.qrCode + " : " + voucher.value + " " + voucher.currency + `<br>`
      })
      this.successMessage = "You have scanned sufficient vouchers. You can now complete the transaction of " +
      productsList + "for a total of " + this.price$.getValue() +
      " using " + this.vouchers.length + " voucher(s) : " + `<br>` + vouchersList
      if (this.vouchersTotalValue > this.price$.getValue()) {
        this.successMessage += `You still have ` + (this.vouchersTotalValue - this.price$.getValue()) + currency + ` available on your vouchers.
          However, they will be considered fully used and cannot be used again. If you would like to add
         further items to your basket, you can go back now and add them, but you will need to scan your vouchers again.`
      }
  }

  async openDifferentBookletModal() {
    let okMessage = 'Cancel transaction and go back to the product page'
    const modal = await this.modalController.create(ConfirmationModal, {
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

  async openProceedModal() {
    let okMessage = 'Proceed and go back to the product page'
    const modal = await this.modalController.create(ConfirmationModal, {
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
    const modal = await this.modalController.create(ConfirmationModal, {
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
}
