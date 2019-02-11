import { Injectable } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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

  constructor() {
  }

  login(vendor) {
    this.vendor.next({
      id:'1',
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
    console.log(this.vendor.getValue())
    return 'done';
  }

  getVendor(): BehaviorSubject<Vendor> {
    return this.vendor
  }

}
