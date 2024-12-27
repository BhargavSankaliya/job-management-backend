import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const ewaypaymentsUrl = 'https://api.sandbox.ewaypayments.com/';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith(ewaypaymentsUrl)) {
            req = req.clone({
                setHeaders: { 'Access-Control-Allow-Origin': '*' } // Not recommended for production
            });
        }
        return next.handle(req);
    }
}