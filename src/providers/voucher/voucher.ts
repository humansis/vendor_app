import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Voucher } from '../../model/voucher';
import { Storage } from '@ionic/storage';
import { ChosenProduct } from '../../model/chosenProduct';

@Injectable()
export class VoucherProvider {

    private price = new BehaviorSubject<number>(0);
    private chosenProducts = new BehaviorSubject<ChosenProduct[]>([]);

    constructor(public http: HttpClient, private storage: Storage) {
    }

    /**
     * Set price
     * @param price
     */
    setPrice(price: number): void {
        this.price.next(price);
    }

    /**
     * Get price
     */
    getPrice(): BehaviorSubject<number> {
        return this.price;
    }

    /**
     * Set chosen products
     * @param chosenProducts
     */
    setChosenProducts(chosenProducts: ChosenProduct[]): void {
        this.chosenProducts.next(chosenProducts);
    }

    /**
     * Get chosen producs
     */
    getChosenProducts(): BehaviorSubject<ChosenProduct[]> {
        return this.chosenProducts;
    }

    /**
     * Scan vouchers
     * @param vouchers
     */
    scanVouchers(vouchers: Voucher[]): void {
        this.storage.get('vouchers').then(cacheVouchers => {
            const alreadyStoredVouchers = cacheVouchers || [];
            vouchers.forEach(voucher => {
                alreadyStoredVouchers.push(voucher);
            });
            this.storage.set('vouchers', alreadyStoredVouchers);
        });
    }
}
