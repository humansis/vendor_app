import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScanPage } from '../scan/scan';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Product } from '../../model/product';
import { Observable } from 'rxjs'
import { SyncProvider } from '../../providers/sync/sync';

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

	products$: Observable<Product[]>;
    
	public isItemSelected: boolean = false;
	public selectedProduct: Product = null;
	public allChosenProducts: Array<any> = [];
	
    public typing: string = 'quantity';
    public quantity: number;
    public price: number;
	public total: number = 0;
    
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public voucherProvider: VoucherProvider,
		private syncProvider: SyncProvider
	) {
	}

	goToScanPage() {
		this.voucherProvider.setPrice(this.total);
		this.voucherProvider.setChosenProducts(this.allChosenProducts);
		this.navCtrl.push(ScanPage);
	}

	selectProduct(product) {
		if (product == this.selectedProduct) {
			this.clearSelection();
		} else {
            this.clearSelection();
			this.isItemSelected = true;
			this.selectedProduct = product;
		}
	}

	animateDrawer(drawer) {
		drawer.close();
		setTimeout(() => {
			drawer.open();
		}, 300);
	}
    
	addToBasket() {
        if (this.quantity && this.price) {
            this.allChosenProducts.push({
				product: this.selectedProduct,
				quantity: this.quantity,
				price: this.price,
				subTotal: this.price * this.quantity
			});
    		this.allChosenProducts.forEach(element => {
                this.total += element.subTotal
            });
        }
        this.clearSelection();
	}
    
    clearSelection() {
        this.isItemSelected = false;
        this.selectedProduct = null;
        this.typing = 'quantity';
        this.quantity = null;
        this.price = null;
    }

	clearItemList() {
		this.allChosenProducts = [];
		this.total = 0;
	}

	ngOnInit() {
		this.products$ = this.syncProvider.getProducts()
		this.products$.subscribe(products => {
		})
	  }
}
