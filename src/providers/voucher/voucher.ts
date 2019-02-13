import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Voucher } from '../../model/voucher'
import { Storage } from '@ionic/storage';
import { Product } from '../../model/product';

/*
  Generated class for the VoucherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VoucherProvider {

  private price = new BehaviorSubject<number>(0);
  private products = new BehaviorSubject<Product[]>([])

  constructor(public http: HttpClient, private storage: Storage) {
  }

  setPrice(price: number): void {
    this.price.next(price)
  }

  getPrice(): BehaviorSubject<number> {
    return this.price
  }

  setProducts(products: Product[]): void {
    this.products.next(products)
  }

  getProducts(): BehaviorSubject<Product[]> {
    return this.products
  }

  scanVouchers(vouchers: Voucher[]): void {
    this.storage.get("vouchers").then(cacheVouchers => {
      let alreadyStoredVouchers = cacheVouchers || [];
      vouchers.forEach(voucher => {
        alreadyStoredVouchers.push(voucher)
        console.log('qrCode : ' + voucher.qrCode)
        console.log('vendorId : ' + voucher.vendorId)
        console.log('price : ' + voucher.price)
        console.log('products :' + voucher.productIds)
        console.log('currency :' + voucher.currency)
        console.log('value :' + voucher.value)
        console.log('booklet :' + voucher.booklet)
        console.log('id : ' + voucher.id) // will be used in the url
      })
      this.storage.set("vouchers", alreadyStoredVouchers)
    });
    
  } 

}
