import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppConfig } from '../../app.config';

@Injectable()
export class HttpService {
  baseUrl = '';
  private headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = AppConfig.baseUrl;
  }

  public get(url: string, params = {}): Observable<any> {
    return this.request('GET', url, {}, params);
  }

  public post(url: string, body: any = {}, params = {}): Observable<any> {
    return this.request('POST', url, body, params);
  }

  public put(url: string, body: any = {}, params = {}): Observable<any> {
    return this.request('PUT', url, body, params);
  }

  public patch(url: string, body: any = {}, params = {}): Observable<any> {
    return this.request('PATCH', url, body, params);
  }

  public delete(url: string, body: any = {}, params = {}): Observable<any> {
    return this.request('DELETE', url, body, params);
  }

  upload(fileItem: File, url: string, extraData?: object): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('fileItem', fileItem, fileItem.name);
    if (extraData) {
      // tslint:disable-next-line:forin
      for (const key in extraData) {
        // iterate and set other form data
        formData.append(key, extraData[key]);
      }
    }

    const req = new HttpRequest('POST', `${this.baseUrl}/${url}`, {
      body: formData,
      headers: new HttpHeaders().set('Accept', 'application/json')
      .set('Content-Type', 'multipart/form-data'),
      reportProgress: true
    }, { reportProgress: true });
    return this.http.request(req);
  }

  public request(method: string, url, body: any = {}, params = {}) {
    url = `${this.baseUrl}/${url}`;
    return this.http.request(method, url, {
      body: body,
      headers: this.headers,
      params: this.buildParams(params)
    });
  }

  public buildParams(paramsObj: any): HttpParams {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach((key) => {
      params = params.set(key, paramsObj[key]);
    });
    return params;
  }

  public resetHeaders(): void {
    this.headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  public setHeader(key: string, value: string): void {
    this.headers = this.headers.set(key, value);
  }

  public deleteHeader(key: string): void {
    this.headers = this.headers.delete(key);
  }
}
