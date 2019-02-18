import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Voucher } from '../../model/voucher';


@Injectable()
export class SyncProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  URL_BMS_API: string = process.env.URL_BMS_API;

  sync(vouchers: Voucher[], booklets: string[]) {
    return new Promise<object[]>((resolve, reject) => {
      this.sendVouchers(vouchers).subscribe((response) => {
        this.sendBooklets(booklets).subscribe((response) => {
          this.getDeactivatedBooklets().subscribe(booklets => {
            resolve(booklets)
          }), error => {
            reject(error)
          }
        }, error => {
          reject(error)
        })
      }, error => {
        reject(error)
      })
    })
  }
  
  sendVouchers(vouchers: Voucher[]) {
    return  this.http.post(this.URL_BMS_API + '/vouchers/scanned', vouchers)
  }

  sendBooklets(booklets: string[]) {
    return this.http.post(this.URL_BMS_API + '/deactivate-booklets', booklets)
  }

  getDeactivatedBooklets() {
    return this.http.get<Array<object>>(this.URL_BMS_API + '/deactivated-booklets')
  }
}
