import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Voucher } from '../../model/voucher'
import { Storage } from '@ionic/storage';
import { Product } from '../../model/product';
import { ChosenProduct } from '../../model/chosenProduct';

@Injectable()
export class VoucherProvider {

  private price = new BehaviorSubject<number>(0);
  private chosenProducts = new BehaviorSubject<ChosenProduct[]>([])

  constructor(public http: HttpClient, private storage: Storage) {
  }

  setPrice(price: number): void {
    this.price.next(price)
  }

  getPrice(): BehaviorSubject<number> {
    return this.price
  }

  setChosenProducts(chosenProducts: ChosenProduct[]): void {
    this.chosenProducts.next(chosenProducts)
  }

  getChosenProducts(): BehaviorSubject<ChosenProduct[]> {
    return this.chosenProducts
  }

  scanVouchers(vouchers: Voucher[]): void {
    this.storage.get("vouchers").then(cacheVouchers => {
      let alreadyStoredVouchers = cacheVouchers || [];
      vouchers.forEach(voucher => {
        alreadyStoredVouchers.push(voucher)
      })
      this.storage.set("vouchers", alreadyStoredVouchers)
    });
    
  } 

}
