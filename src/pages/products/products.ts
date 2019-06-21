import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScanPage } from '../scan/scan';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Product } from '../../model/product';
import { Observable } from 'rxjs';
import { SyncProvider } from '../../providers/sync/sync';
import { ChosenProduct } from '../../model/chosenProduct';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage implements OnInit {

    products$: Observable<Product[]>;

    public isItemSelected = false;
    public selectedProduct: Product = null;
    public allChosenProducts: Array<any> = [];

    public typing = 'quantity';
    public quantity: number;
    public price: number;
    public total = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public voucherProvider: VoucherProvider,
        private syncProvider: SyncProvider,
        private alertCtrl: AlertController
    ) {
    }

    /**
     * Method executed on component creation
     */
    ngOnInit() {
        this.syncProvider.getProductsFromApi();
        this.products$ = this.syncProvider.getProducts();
        this.products$.subscribe(products => {
            // TODO: do something
        });
    }

    /**
     * Navigate to scan page
     */
    goToScanPage() {
        this.voucherProvider.setPrice(this.total);
        this.voucherProvider.setChosenProducts(this.allChosenProducts);
        this.navCtrl.push(ScanPage);
    }

    /**
     * Select product
     * @param  product
     */
    selectProduct(product) {
        if (product === this.selectedProduct) {
            this.clearSelection();
        } else {
            this.clearSelection();
            this.isItemSelected = true;
            this.selectedProduct = product;
        }
    }

    /**
     * Create short animation for right-hand drawer
     * @param  drawer
     */
    animateDrawer(drawer) {
        drawer.close();
        setTimeout(() => {
            drawer.open();
        }, 300);
    }

    /**
     * Add product to basket
     */
    addToBasket() {
        if (this.quantity && this.price) {
            this.allChosenProducts.push({
                product: this.selectedProduct,
                quantity: this.quantity,
                price: this.price,
                subTotal: Math.trunc(this.price * this.quantity * 100) / 100  // To have 2 decimals for the cents
            });
            this.total = 0;
            this.allChosenProducts.forEach(element => {
                this.total += element.subTotal;
            });
        }
        this.clearSelection();
    }

    /**
     * Clear selected product
     */
    clearSelection() {
        this.isItemSelected = false;
        this.selectedProduct = null;
        this.typing = 'quantity';
        this.quantity = null;
        this.price = null;
    }

    /**
     * Clear selected products (basket)
     */
    clearItemList() {
        const alert = this.alertCtrl.create({
            title: 'Empty cart',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        return;
                    }
                },
                {
                    text: 'Yes',
                    handler: data => {
                        this.allChosenProducts = [];
                        this.total = 0;
                    }
                }
            ],
            message: 'Are you sure you want to empty your cart ?'
        });
        alert.present();
    }

    /**
     * Remove a product from the cart
     */
    removeFromCart(item: ChosenProduct) {
        const alert = this.alertCtrl.create({
            title: 'Remove product',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        return;
                    }
                },
                {
                    text: 'Yes',
                    handler: data => {
                        this.allChosenProducts = this.allChosenProducts.filter((product, index, array) => {
                            return product !== item;
                        });
                        this.total = this.total - item.subTotal;
                    }
                }
            ],
            message: 'Are you sure you want to remove this product from your cart ?'
        });
        alert.present();
    }
}
