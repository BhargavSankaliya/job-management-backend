import { Injectable, effect } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders, HttpBackend } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { notification } from '../../shared/libraries/notifications.library';
import { CommonService } from '../../shared/common.service';
import { getSessionData, StorageKey } from './urls.service';



@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  userInfo: any = {};
  accessToken: any;


  constructor(private http: HttpClient, private httpFrontend: HttpClient, handler: HttpBackend, private commonService: CommonService,) {
    this.httpFrontend = new HttpClient(handler);
  }

  token: any = getSessionData(StorageKey.TOKEN)

  getHeaders() {
    let token: any = getSessionData(StorageKey.TOKEN)
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': !!token ? `Bearer ${token}` : ''
    })
  }
  getHeadersForm() {
    let token: any = getSessionData(StorageKey.TOKEN)
    return new HttpHeaders({
      'Authorization': !!token ? `Bearer ${token}` : ''
    })
  }
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': !!getSessionData(StorageKey.TOKEN) ? `Bearer ${getSessionData(StorageKey.TOKEN)}` : ''
  })
  headersFormData = new HttpHeaders({
    'Content-Type': 'application/form-data'
  })

  get(path: string, params?: any): Observable<any> {
    return this.http.get(
      `${this.commonService.rootData.rootUrl}${path}`,
      { params, headers: this.getHeaders() },
    )
      .pipe(catchError(this.formatErrors));
  }
  getForGuest(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpFrontend.get(
      `${this.commonService.rootData.rootUrl}${path}`,
      { params, headers: this.getHeaders() },
    )
      .pipe(catchError(this.formatErrors));
  }
  request(path: string, bodyData: any): Observable<any> {

    const url = `${this.commonService.rootData.rootUrl}${path}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.request('GET', url, {
      body: JSON.stringify(bodyData),
      headers: headers
    }).pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.commonService.rootData.rootUrl}${path}`,
      body,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }
  putForGuest(path: string, body: Object = {}): Observable<any> {
    return this.httpFrontend.put(
      `${this.commonService.rootData.rootUrl}${path}`,
      body,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${this.commonService.rootData.rootUrl}${path}`,
      JSON.stringify(body),
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  postForGuest(path: string, body: Object = {}): Observable<any> {
    return this.httpFrontend.post(
      `${this.commonService.rootData.rootUrl}${path}`,
      JSON.stringify(body),
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  postform(path: string, body: FormData): Observable<any> {
    return this.http.post(
      `${this.commonService.rootData.rootUrl}${path}`,
      body,
      { headers: this.getHeadersForm() }
    ).pipe(catchError(this.formatErrors));
  }
  putform(path: string, body: FormData): Observable<any> {
    return this.http.put(
      `${this.commonService.rootData.rootUrl}${path}`,
      body,
      { headers: this.getHeadersForm() }
    ).pipe(catchError(this.formatErrors));
  }

  delete(path: any): Observable<any> {
    return this.http.delete(
      `${this.commonService.rootData.rootUrl}${path}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }
  deleteBody(path: string, body: Object = {}): Observable<any> {
    return this.http.delete(
      `${this.commonService.rootData.rootUrl}${path}`,
      { headers: this.getHeaders(), body: body },
    ).pipe(catchError(this.formatErrors));
  }

  deletePromise(path: any): Promise<any> {

    return this.http.delete(
      `${this.commonService.rootData.rootUrl}${path}`,

    ).toPromise();
  }
  private formatErrors(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      notification('error', "Something went wrong, Please try after sometimes.", 1000);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
      if (error.error.meta.code == 401) {
        localStorage.clear();
        window.location.reload()
        notification('error', error.error.meta.message, 1000);
      }
      else {
        notification('error', error.error.meta.message, 1000);
      }

    }
    // return an observable with a user-facing error message
    return throwError({ msg: error.message, status: error.status, code: error.status });
    // return error;
  };
}