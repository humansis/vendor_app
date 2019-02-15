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
		return new Promise<boolean>((resolve, reject) => {
      this.sendVouchers(vouchers)
      this.sendBooklets(booklets)
    })
  }
  
  sendVouchers(vouchers: Voucher[]) {
    return vouchers.forEach(voucher => {
      this.http.post(URL_BMS_API + '/vouchers/scanned/' + voucher.id, voucher).subscribe(success => {
      })
    })
  }

  sendBooklets(booklets: string[]) {
    return booklets.forEach(booklet => {
      this.http.delete(URL_BMS_API + '/booklets/' + booklet).subscribe(success => {})
    })
  }
}
