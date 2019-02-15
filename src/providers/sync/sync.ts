import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Voucher } from '../../model/voucher';

const URL_BMS_API = 'http://0.0.0.0:8087/api/wsse';

@Injectable()
export class SyncProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  sync(vouchers: Voucher[], booklets: string[]) {
    return new Promise((resolve, reject) => {
      this.sendVouchers(vouchers).subscribe((response) => {
        this.sendBooklets(booklets).subscribe((response) => {
          resolve(true)
        }, error => {
          reject(error)
        })
      }, error => {
        reject(error)
      })
    })
  }
  
  sendVouchers(vouchers: Voucher[]) {
    return  this.http.post(URL_BMS_API + '/vouchers/scanned', vouchers)
  }

  sendBooklets(booklets: string[]) {
    return this.http.post(URL_BMS_API + '/deactivate-booklets', booklets)
  }
}
