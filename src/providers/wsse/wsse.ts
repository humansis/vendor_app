import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Injectable()
export class WsseProvider {

    private username: string;
    private salted: string;
    private chrsz = 8;
    private b64pad = '=';

    constructor(public http: HttpClient, private storage: Storage) {
    }

    /**
     * Get headers for HTTP request
     * @param  vendor
     */
    getHeaderValue(vendor?) {
        return Observable.fromPromise(this.storage.get('vendor')).pipe(
            map(
                result => {
                    const cachedVendor = result;

                    if (cachedVendor) {
                        this.username = cachedVendor.user.username;
                        this.salted = cachedVendor.salted_password;
                    } else {
                        this.username = vendor.user.username;
                        this.salted = vendor.salted_password;
                    }

                    const nonce = this.generateNonce(16);
                    const created = this.getDate(new Date());
                    const nonce64 = this.base64encode(nonce);
                    const digest = this.getDigest(nonce, created, this.salted);

                    const header = 'UsernameToken Username=\"' + this.username +
                    '\", PasswordDigest=\"' + digest +
                    '\", Nonce=\"' + nonce64 +
                    '\", Created=\"' + created + '\"';
                    return header;
                }
            )
        );
    }

    // ------------------------------------------------------------------------//
    // ---------------------------------WSSE-----------------------------------//
    // ------------------------------------------------------------------------//

    /**
     * Generate arbitrary number which is only used once to be sure old communications can't be reused
     * @param  lgth
     */
    generateNonce(lgth) {
        const nonceChars = '0123456789abcdef';
        let nonce = '';

        for (let i = 0; i < lgth; i++) {
            nonce += nonceChars.charAt(Math.floor(Math.random() * nonceChars.length));
        }

        return nonce;
    }

    /**
     * Encrypt expression
     * @param  exp
     * @param  lgth
     */
    sha1(exp, lgth) {
        // Add padding
        exp[lgth >> 5] |= 0x80 << (24 - lgth % 32);
        exp[((lgth + 64 >> 9) << 4) + 15] = lgth;

        const newExp = new Array(80);
        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        let e = -1009589776;

        for (let i = 0; i < exp.length; i += 16) {
            const oldA = a;
            const oldB = b;
            const oldC = c;
            const oldD = d;
            const oldE = e;

            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    newExp[j] = exp[i + j];
                } else {
                    newExp[j] = this.rol(newExp[j - 3] ^ newExp[j - 8] ^ newExp[j - 14] ^ newExp[j - 16], 1);
                }
                const t = this.safeAdd(
                    this.safeAdd(this.rol(a, 5), this.sha1Ft(j, b, c, d)),
                    this.safeAdd(this.safeAdd(e, newExp[j]), this.sha1Kt(j))
                );
                e = d;
                d = c;
                c = this.rol(b, 30);
                b = a;
                a = t;
            }
            a = this.safeAdd(a, oldA);
            b = this.safeAdd(b, oldB);
            c = this.safeAdd(c, oldC);
            d = this.safeAdd(d, oldD);
            e = this.safeAdd(e, oldE);
        }

        const sha1 = new Array(a, b, c, d, e);
        return sha1;
    }

    /**
     * Rotate a 32-bit number to the left
     * @param  num
     * @param  cnt
     */
    rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /**
     * Add integers, wrapping at 2^32
     * This uses 16-bit operations internally to work around bugs in some JS interpreters
     * @param  x
     * @param  y
     */
    safeAdd(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);

        return (msw << 16) | (lsw & 0xFFFF);
    }

    /**
     * Perform the appropriate triplet combination function for the current iteration
     * @param  t
     * @param  b
     * @param  c
     * @param  d
     */
    sha1Ft(t, b, c, d) {
        if (t < 20) { return (b & c) | ((~b) & d); }
        if (t < 40) { return b ^ c ^ d; }
        if (t < 60) { return (b & c) | (b & d) | (c & d); }

        return b ^ c ^ d;
    }

    /**
     * Determine the appropriate additive constant for the current iteration
     * @param  t
     */
    sha1Kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
            (t < 60) ? -1894007588 : -899497514;
    }

    /**
     * Get current date in yyyy-mm-ddThh:mn:ssZ format
     * @param  date
     */
    getDate(date) {
        const yyyy = date.getUTCFullYear();
        let mm = date.getUTCMonth() + 1;
        let dd = date.getUTCDate();
        let hh = date.getUTCHours();
        let mn = date.getUTCMinutes();
        let ss = date.getUTCSeconds();

        if (mm < 10) { mm = '0' + mm; }
        if (dd < 10) { dd = '0' + dd; }
        if (hh < 10) { hh = '0' + hh; }
        if (mn < 10) { mn = '0' + mn; }
        if (ss < 10) { ss = '0' + ss; }

        const newDate = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + mn + ':' + ss + 'Z';

        return newDate;
    }

    /**
     * Encode variable
     * @param  nonce
     */
    base64encode(nonce) {
        const nonce64 = btoa(nonce);
        return nonce64;
    }

    /**
     * Convert an 8-bit or 16-bit string into an array of big-endian words
     * In 8-bit function, characters >255 have their hi-byte silently ignored
     * @param  str
     */
    strToBin(str) {
        const bin = [];
        const mask = (1 << this.chrsz) - 1;

        for (let i = 0; i < str.length * this.chrsz; i += this.chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (24 - i % 32);
        }

        return bin;
    }

    /**
     * Convert an array of big-endian words to a base-64 string
     * @param  binarray
     */
    binTo64(binarray) {
        const tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let str = '';

        for (let i = 0; i < binarray.length * 4; i += 3) {
            const triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
                | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8)
                | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
            for (let j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) {
                    str += this.b64pad;
                } else {
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
        }

        return str;
    }

    /**
     * Get digest from nonce, date created at and salted password
     * @param  nonce
     * @param  created
     * @param  salted
     */
    getDigest(nonce, created, salted) {
        const mix = nonce + created + salted;
        const sha1 = this.sha1(this.strToBin(mix), mix.length * this.chrsz);

        const digest = this.binTo64(sha1);
        return digest;
    }

}
