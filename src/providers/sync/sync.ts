import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Voucher } from '../../model/voucher';
import { Product } from '../../model/product';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SyncProvider {

    private products = new BehaviorSubject<Product[]>([]);

    constructor(public http: HttpClient, private storage: Storage) {
    }

    URL_BMS_API: string = process.env.URL_BMS_API;

    /**
     * Sync with backend
     * @param  vouchers
     * @param  booklets
     */
    sync(vouchers: Voucher[], booklets: string[]) {
        return new Promise((resolve, reject) => {
            this.sendVouchers(vouchers).subscribe(() => {
                this.sendBooklets(booklets).subscribe(() => {
                    this.getDeactivatedBooklets().then(success => {
                        resolve(success);
                    }, error => {
                        reject(error);
                    });
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error);
            });
        });
    }

    /**
     * Send vouchers
     * @param  vouchers
     */
    sendVouchers(vouchers: Voucher[]) {
        return this.http.post(this.URL_BMS_API + '/vouchers/scanned', vouchers);
    }

    /**
     * Send booklets
     * @param  booklets
     */
    sendBooklets(booklets: string[]) {
        return this.http.post(this.URL_BMS_API + '/deactivate-booklets', booklets);
    }

    /**
     * Get deactivated booklets
     */
    getDeactivatedBooklets() {
        return new Promise((resolve, reject) => {
            this.http.get<Array<object>>(this.URL_BMS_API + '/deactivated-booklets').subscribe(deactivatedBooklets => {
                const deactivatedBookletIds = [];
                deactivatedBooklets.forEach(booklet => {
                    deactivatedBookletIds.push(booklet.id);
                });
                this.storage.set('deactivatedBooklets', deactivatedBookletIds);
                resolve(deactivatedBooklets);
            }, error => {
                reject(error);
            });
        });
    }

    /**
     * Get products from backend
     */
    getProductsFromApi() {
        return new Promise((resolve, reject) => {
            this.http.get<Array<Product>>(this.URL_BMS_API + '/products').subscribe(products => {
                const productList = [];
                products.forEach(product => {
                    productList.push({
                        id: product.id,
                        name: product.name,
                        unit: product.unit,
                        image: product.image
                    });
                });
                this.products.next(productList);
                resolve(products);
            }, error => {
                reject(error);
            });
        });
    }

    /**
     * Get products stored in service
     */
    getProducts(): BehaviorSubject<Product[]> {
        return this.products;
    }
}
