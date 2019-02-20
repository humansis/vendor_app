import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { WsseProvider } from '../providers/wsse/wsse';
import { map, concat, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(
		private _wsseService: WsseProvider
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		// Do not add headers on salt request
		if (!/salt/.test(req.url)) {
			let vendor;
			// On login pass the user credentials to the wsse service
			if (/login_app/.test(req.url)) {
				vendor = {
					user: {
						username: req.body.username,
						salted_password: req.body.salted_password
					}
				};
			}
            
			// Get the auth token from the service.
			return this._wsseService.getHeaderValue(vendor).pipe(
                switchMap(
                    header => {
			            // Clone the request & replace original headers with cloned headers, updated with the authorization.
                        const authReq = req.clone({ setHeaders: { 'x-wsse': header } });
                        // Send cloned request with header to the next handler.
                        return next.handle(authReq);
                    }
                )
            );
		}

		return next.handle(req);
	}
}
