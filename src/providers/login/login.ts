import { Injectable } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { SaltInterface } from '../../model/salt';

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

  requestSalt(username: string): Observable<SaltInterface> {
    return this.http.get<SaltInterface>(URL_BMS_API + '/salt/' + username);
  }

  logUser(vendor: Vendor) {
    return this.http.post(URL_BMS_API + '/login_app', vendor)
  }

  login(vendor: Vendor) {
    return new Promise<Vendor | string | null>((resolve, reject) => {
      this.requestSalt(vendor.username).subscribe(success => {
        let getSalt = success as SaltInterface;
        vendor.salted_password = this.saltPassword(getSalt.salt, vendor.password);
        delete vendor.password;
        return this.logUser(vendor).subscribe(success => {
          let data = success;
          if (data) {
            this.vendor = data as Vendor
            this.vendor.loggedIn = true
            this.storage.set('vendor', this.vendor)
            resolve(this.vendor);
          } else {
            reject({ message: 'Bad credentials' })
          };
        
        })
      })
    })
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
