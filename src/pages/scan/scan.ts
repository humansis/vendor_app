import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Vendor } from '../../model/vendor';
import { Storage } from '@ionic/storage';
import { Voucher } from '../../model/voucher';
import { ProductsPage } from '../products/products';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';
import { FormModal } from '../form-modal/form-modal';
import { ChosenProduct } from '../../model/chosenProduct';


@IonicPage()
@Component({
    selector: 'page-scan',
    templateUrl: 'scan.html',
})
export class ScanPage {

    vouchers: Array<Voucher> = [];
    vouchersTotalValue = 0;
    price$: BehaviorSubject<number>;
    chosenProducts$: BehaviorSubject<ChosenProduct[]>;
    errorMessage = '';
    successMessage = '';
    vendor: Vendor;
    scanDisabled = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private barcodeScanner: BarcodeScanner,
        public voucherProvider: VoucherProvider,
        private storage: Storage,
        public modalController: ModalController) {
    }

    /**
     * Method executed on component creation
     */
    ngOnInit() {
        this.price$ = this.voucherProvider.getPrice();
        this.chosenProducts$ = this.voucherProvider.getChosenProducts();
        this.price$.subscribe(price => {
            // TODO: do something
        });
        this.chosenProducts$.subscribe(products => {
            if (products.length <= 0) {
                this.scanDisabled = true;
                this.errorMessage = 'You haven\'t selected any product, please go back to the previous page.';
            }
        });
        this.storage.get('vendor').then(vendor => {
            this.vendor = vendor;
        });
    }

    /**
     * Scan voucher QR code
     */
    scanCode() {
        let scannedCode = '';
        this.successMessage = '';
        this.errorMessage = '';
        this.barcodeScanner.scan().then(barcodeData => {
            scannedCode = barcodeData.text;
            // all the logic can be moved in here when the scan can be tested
        });
        // meanwhile... (to test, the encoded password is 'secret-password')
        scannedCode = 'USD140*096-098-096-1-avPBIe1KdSk2wpfN37ewA5TqvxA='; // to delete after

        this.ifHasNoPasswordGetInfo(scannedCode).then(success => {
            this.handleScannedCode(scannedCode, success);
        }, reject => {
            this.errorMessage = reject;
        });
    }

    /**
     * Get voucher info if has no password
     * @param  scannedCode
     */
    ifHasNoPasswordGetInfo(scannedCode: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const passwords = [];
            let bookletId = '';
            let scannedCodeInfo = scannedCode.match(/^([A-Za-z$€£]+)(\d+)\*([\d]..-[\d]..-[\d]..)-([\da-z]+)-([\da-zA-Z=\/]+)$/i);
            if (scannedCodeInfo !== null) {
                passwords.push(scannedCodeInfo[5]);
                bookletId = scannedCodeInfo[3];
            } else {
                scannedCodeInfo = scannedCode.match(/^([A-Za-z$€£\d]+)\*([\d]..-[\d]..-[\d]..)$/i);
                if (scannedCodeInfo !== null) {
                    reject('You cannot scan a booklet code, you have to scan the vouchers individually.');
                } else {
                    scannedCodeInfo = scannedCode.match(/^([A-Za-z$€£]+)(\d+)\*([\d]..-[\d]..-[\d]..)-([\da-z]+)$/i);
                    if (scannedCodeInfo !== null) {
                        bookletId = scannedCodeInfo[3];
                    } else {
                        reject('Your code isn\'t the right format, are you sure it is a BMS Voucher ?');
                    }
                }
            }

            this.storage.get('protectedBooklets').then(booklets => {
                booklets.forEach(booklet => {
                    if (booklet.hasOwnProperty(bookletId)) {
                        passwords.push(booklet[bookletId]);
                    }
                });
                if (passwords.length > 0) {
                    this.openPasswordModal(scannedCode, passwords, scannedCodeInfo);
                } else {
                    resolve(scannedCodeInfo);
                }
            });
        })
    }

    /**
     * Get booklet id from it code
     * @param  booklet
     */
    getBookletIdFromCode(booklet: string): number {
        return parseInt(booklet.split('-').pop(), 10);
    }

    /**
     * Open password modal
     * @param  scannedCode
     * @param  scannedCodeInfo
     */
    openPasswordModal(scannedCode: string, passwords: string[], scannedCodeInfo: string[]) {
        const okMessage = 'Submit';
        const cancelButton = 'Go back to the scan page';
        const modal = this.modalController.create(FormModal, {
            title: 'Password',
            message: 'Please enter the voucher\'s password',
            okButton: okMessage,
            cancelButton: cancelButton,
            saltedPasswords: passwords,
            triesMessage: 'Be aware that you have only three tries before your booklet deactivates.',
            tries: 3
        });

        modal.onDidDismiss(data => {
            if (data === okMessage) {
                this.handleScannedCode(scannedCode, scannedCodeInfo);
            } else if (data === cancelButton) {
                return;
            } else {
                this.storage.get('deactivatedBooklets').then(cacheBooklets => {
                    const alreadyStoredBooklets = cacheBooklets || [];
                    alreadyStoredBooklets.push(this.getBookletIdFromCode(scannedCodeInfo[3]));
                    this.storage.set('deactivatedBooklets', alreadyStoredBooklets);
                });
                this.errorMessage = 'You have exceeded your tries at password, your booklet will be deactivated';
                return;
            }
        });
        modal.present();
    }

    /**
     * Handle scanned voucher
     * @param  scannedCode
     * @param  scannedCodeInfo
     */
    handleScannedCode(scannedCode: string, scannedCodeInfo: string[]) {
        let previousBooklet = this.vouchers.length ? this.vouchers[0].booklet : null;
        previousBooklet = '096-098-096'; // to delete after
        const newBooklet = scannedCodeInfo[3];

        this.storage.get('deactivatedBooklets').then(deactivatedBooklets => {
            if (deactivatedBooklets && deactivatedBooklets.includes(this.getBookletIdFromCode(newBooklet))) {
                this.errorMessage = 'You cannot use this booklet because it has previously been deactivated.';
                return;
            }
            if (previousBooklet && previousBooklet !== newBooklet) {
                this.openDifferentBookletModal();
                return;
            }

            const productIds = [];
            this.chosenProducts$.getValue().forEach(chosenPoduct => {
                productIds.push(chosenPoduct.product.id);
            });
            this.vouchers.push({
                id: parseInt(scannedCodeInfo[4], 10),
                qrCode: scannedCode,
                vendorId: this.vendor.id,
                productIds: productIds,
                price: this.price$.getValue(),
                currency: scannedCodeInfo[1],
                value: parseInt(scannedCodeInfo[2], 10),
                booklet: scannedCodeInfo[3],
                used_at: new Date()
            });
            const scannedCodeValue = scannedCodeInfo[2];
            this.vouchersTotalValue += parseInt(scannedCodeValue, 10);

            if (this.vouchersTotalValue >= this.price$.getValue()) {
                this.setMessageSuccess(scannedCodeInfo[1]);
            } else {
                this.errorMessage = 'Your vouchers (' + this.vouchersTotalValue + scannedCodeInfo[1] +
                    ') are not high enough to pay ' + this.price$.getValue() + '.' +
                    `<br> Please scann another one`;
            }
        });
    }

    /**
     * Define success message
     * @param  currency
     */
    setMessageSuccess(currency: string) {
        let productsList = '';
        this.chosenProducts$.getValue().forEach(product => {
            productsList += product.quantity +
                (product.product.unit !== 'Unit' && product.product.unit !== '' ? product.product.unit + ' of ' : ' ') +
                product.product.name + ', ';
        });
        let vouchersList = '';
        this.vouchers.forEach(voucher => {
            vouchersList += '-' + voucher.qrCode + ' : ' + voucher.value + ' ' + voucher.currency + `<br>`;
        });
        this.successMessage = 'You have scanned sufficient vouchers. You can now complete the transaction of ' +
            productsList + 'for a total of ' + this.price$.getValue() +
            ' using ' + this.vouchers.length + ' voucher(s) : ' + `<br>` + vouchersList;
        if (this.vouchersTotalValue > this.price$.getValue()) {
            this.successMessage += `You still have ` + (this.vouchersTotalValue - this.price$.getValue()) + currency +
            ` available on your vouchers.
          However, they will be considered fully used and cannot be used again. If you would like to add
         further items to your basket, you can go back now and add them, but you will need to scan your vouchers again.`;
        }
    }

    /**
     * Open modal warning for a voucher from a different booklet
     */
    async openDifferentBookletModal() {
        const okMessage = 'Cancel transaction and go back to the product page';
        const modal = await this.modalController.create(ConfirmationModal, {
            title: 'Vouchers from a different booklet',
            message: 'You now are using the booklet of another beneficiary.' +
                ' Are you sure you want to end the previous transaction and move on to a new one?' +
                ' Your previous vouchers won\'t be considered as used and your products list will empty.',
            okButton: okMessage,
            cancelButton: 'Go back to the scan page'
        });
        modal.onDidDismiss(data => {
            if (data === okMessage) {
                this.cancelTransaction();
            }
        });
        return await modal.present();
    }

    /**
     * Open proceed modal
     */
    async openProceedModal() {
        const okMessage = 'Proceed and go back to the product page';
        const modal = await this.modalController.create(ConfirmationModal, {
            title: 'Proceed transaction',
            message: 'Are you sure you want to proceed with this transaction ?' +
                ' Your vouchers will be considered as used and kept by the vendor.',
            okButton: okMessage,
            cancelButton: 'Go back to the scan page'
        });
        modal.onDidDismiss(data => {
            if (data === okMessage) {
                this.completeTransaction();
            }
        });
        return await modal.present();
    }

    /**
     * Open cancel modal
     */
    async openCancelModal() {
        const okMessage = 'Cancel transaction and go back to the product page';
        const modal = await this.modalController.create(ConfirmationModal, {
            title: 'Cancel transaction',
            message: 'Are you sure you want to cancel this transaction ?' +
                ' Your vouchers won\'t be considered as used and your products list will empty.',
            okButton: okMessage,
            cancelButton: 'Go back to the scan page'
        });
        modal.onDidDismiss(data => {
            if (data === okMessage) {
                this.cancelTransaction();
            }
        });
        return await modal.present();
    }

    /**
     * Complete transaction and go to products page
     */
    completeTransaction() {
        this.voucherProvider.scanVouchers(this.vouchers);
        this.navCtrl.push(ProductsPage);
    }

    /**
     * Cancel transaction and go to products page
     */
    cancelTransaction() {
        this.vouchers = [];
        this.vouchersTotalValue = 0;
        this.voucherProvider.setPrice(null);
        this.voucherProvider.setChosenProducts([]);
        this.navCtrl.push(ProductsPage);
    }
}
