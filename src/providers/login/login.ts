import { Injectable } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const URL_BMS_API = 'http://0.0.0.0:8087/api/wsse';

@Injectable()
export class LoginProvider {

  private vendor = new BehaviorSubject<Vendor>({
    id:'',
    username:'',
    password:'',
    salted_password:'',
    address:'',
    shop: '',
    name: '',
    loggedIn: false,
    products: [],
    country: [],
    language: ''
  })

  constructor(public http: HttpClient) {
  }

  requestSalt(username) {
    return this.http.get(URL_BMS_API + '/salt/' + username);
  }

  login(vendor) {
    // this.requestSalt(vendor.username).subscribe(success => {
    //   let getSalt = success as string;
    //   vendor.salted_password = this.saltPassword(getSalt, vendor.password);
    //   delete vendor.password;
    //   return this.http.post(URL_BMS_API + '/login_app', vendor).subscribe(success => {
    //     let data = success;
    //     if (data) {
    //       this.vendor.next({
    //         id: data['id'],
    //         username:data['username'],
    //         password:'',
    //         salted_password:'',
    //         address:data['address'],
    //         shop: data['shop'],
    //         name: data['name'],
    //         loggedIn: true,
    //         products: data['products'],
    //         country: data['country'],
    //         language: data['language']
    //       })
    //     } else {
    //         // Bad credentials
    //     };
    //   console.log(this.vendor.getValue())
    //   return 'done';
    //   })
    // })

  this.vendor.next({
    id: 'id',
    username:'username',
    password:'',
    salted_password:'',
    address:'address',
    shop: 'shop',
    name: 'name',
    loggedIn: true,
    products: [],
    country: [],
    language: 'language'
  })
}

  getVendor(): BehaviorSubject<Vendor> {
    return this.vendor
  }

  saltPassword(salt, password) {
		let salted = password + '{' + salt + '}';
		let digest = CryptoJS.SHA512(salted);

		for (let i = 1; i < 5000; i++) {
			digest = CryptoJS.SHA512(digest.concat(CryptoJS.enc.Utf8.parse(salted)));
		}
		
		let saltedPassword = CryptoJS.enc.Base64.stringify(digest);
		return saltedPassword;
  }
  
  // add logout
  // add password forgotten
  // add recaptcha ?

}
