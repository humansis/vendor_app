import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*
  Generated class for the VoucherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VoucherProvider {

  private price = new BehaviorSubject<number>(0);
  private productIds = new BehaviorSubject<number[]>([])

  constructor(public http: HttpClient) {
  }

  setPrice(price: number): void {
    this.price.next(price)
  }

  getPrice(): BehaviorSubject<number> {
    return this.price
  }

  setProductIds(productIds: number[]): void {
    this.productIds.next(productIds)
  }

  getProductIds(): BehaviorSubject<number[]> {
    return this.productIds
  }

}
