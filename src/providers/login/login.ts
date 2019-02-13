import { Injectable } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const URL_BMS_API = 'http://0.0.0.0:8087/api/wsse';

@Injectable()
export class LoginProvider {

  private vendor = new Vendor;

  constructor(public http: HttpClient, private storage: Storage) {
  }

  requestSalt(username: string) : Observable<string> {
    return this.http.get<string>(URL_BMS_API + '/salt/' + username);
  }

  login(vendor: Vendor) : void {
    // this.requestSalt(vendor.username).subscribe(success => {
    //   let getSalt = success;
    //   vendor.salted_password = this.saltPassword(getSalt, vendor.password);
    //   delete vendor.password;
    //   return this.http.post(URL_BMS_API + '/login_app', vendor).subscribe(success => {
    //     let data = success;
    //     if (data) {
    //       this.vendor = data as Vendor
    //     } else {
    //         // Bad credentials
    //     };
    //   console.log(this.vendor)
    //   return 'done';
    //   })
    // })
  this.vendor.id = '1'
  this.storage.set('vendor', this.vendor)
}

  saltPassword(salt: string, password: string) : string {
		let salted = password + '{' + salt + '}';
		let digest = CryptoJS.SHA512(salted);

		for (let i = 1; i < 5000; i++) {
			digest = CryptoJS.SHA512(digest.concat(CryptoJS.enc.Utf8.parse(salted)));
		}
		
		let saltedPassword = CryptoJS.enc.Base64.stringify(digest);
		return saltedPassword;
  }
  
  // add password forgotten
  // add recaptcha ?

}
