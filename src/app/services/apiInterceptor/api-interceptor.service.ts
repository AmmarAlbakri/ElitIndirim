import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    let authReq = req.clone({
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'zeroLang': localStorage.getItem('selectedLanguage').toUpperCase() || 'TR',
        'zeroCurrency': 'TRY'
      })
    });
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null && user != undefined) {
      authReq = req.clone({
        headers: new HttpHeaders({
          // 'Access-Control-Allow-Origin': '*',
          // 'Content-Type': 'application/json',
          'Authorization': 'bearer ' + user['token'],
          'zeroLang': localStorage.getItem('selectedLanguage').toUpperCase() || 'TR',
          'zeroCurrency': 'TRY'
        })
      });
    }
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
