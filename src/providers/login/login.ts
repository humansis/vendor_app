import { Injectable } from '@angular/core';
import { Vendor } from '../../model/vendor';
/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const URL_BMS_API = 'http://0.0.0.0:8087/api/wsse';

@Injectable()
export class LoginProvider {

  private vendor: Vendor

  constructor() {
  }

  login(vendor) {
    console.log('log')
    return 'done';
  }

}
