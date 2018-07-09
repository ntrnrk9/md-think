import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorInfo } from '../common/errorDisplay';
import { ListDataItem, PaginationRequest } from '../entities/common.entities';
import { HttpService } from './http.service';
import { HttpRequest } from '@angular/common/http';
@Injectable()
export class GenericService<T> {
  error: ErrorInfo = new ErrorInfo();
  endpointUrl: string;
  constructor(private http: HttpService) {
  }

  getAll(url?: string) {
    const request = this.http.get(this.getUrl(url));
    return request.map((result: T[]) => {
      return result;
    }, (err) => {
      console.log(err);
      this.error.error(err);
    });
  }

  getAllPaged(options: PaginationRequest, url?: string) {
    const request = this.http.get(`${this.getUrl(url)}/list?filter=` + JSON.stringify(options));
    return request.map((result: ListDataItem<T>) => {
      return result;
    }, (err) => {
      console.log(err);
      this.error.error(err);
    });
  }
  getAllFilter(options: PaginationRequest, url?: string) {
    const request = this.http.post(`${this.getUrl(url)}`, JSON.stringify(options));
    return request.map((result: ListDataItem<T>) => {
      return result;
    }, (err) => {
      console.log(err);
      this.error.error(err);
    });
  }

  getById(id: number | string, url?: string) {
    return this.http.get(`${this.getUrl(url)}/${id}`).map((data: T) => {
      return data;
    }, (err) => {
      this.error.error(err);
    });
  }

  create(item: T, url?: string) {
    return this.http.post(this.getUrl(url), JSON.stringify(item)).map((data: T) => {
      return data;
    }, (err) => {
      this.error.error(err);
    });
  }

  createArrayList(item: T[], url?: string) {
    return this.http.post(this.getUrl(url), JSON.stringify(item)).map((data: T[]) => {
      return data;
    }, (err) => {
      this.error.error(err);
    });
  }
  update(id: number | string, item: T, url?: string) {
    return this.http.put(`${this.getUrl(url)}/${id}`, JSON.stringify(item)).map((data: T) => {
      return data;
    }, (err) => {
      this.error.error(err);
    });
  }

  patch(id: number | string, item?: any, url?: string) {
    return this.http.patch(`${this.getUrl(url)}/${id}`, JSON.stringify(item)).map((data: T) => {
      return data;
    }, (err) => {
      this.error.error(err);
    });
  }

  remove(id: number | string, item?: any, url?: string) {
    return this.http.delete(`${this.getUrl(url)}/${id}`, JSON.stringify(item)).map((response: T) => {
      return response;
    }, (err) => {
      this.error.error(err);
    });
  }

  getUrl(url: string) {
    return url ? url : this.endpointUrl;
  }

  getSingle(options: PaginationRequest | any, url?: string) {
    let request: Observable<any>;
    if (!options.method) {
      request = this.http.get(`${this.getUrl(url)}`);
    } else if (options.method === 'get') {
      request = this.http.get(`${this.getUrl(url)}=` + JSON.stringify(options));
    } else if (options.method === 'post') {
      request = this.http.post(`${this.getUrl(url)}`, JSON.stringify(options));
    }
    return request.map((result: T) => {
      return result;
    }, (err) => {
      console.log(err);
      this.error.error(err);
    });
  }

  getArrayList(options: PaginationRequest | any, url?: string) {
    let request: Observable<any>;
    if (!options.method) {
      request = this.http.get(`${this.getUrl(url)}`);
    } else if (options.method === 'get') {
      request = this.http.get(`${this.getUrl(url)}=` + JSON.stringify(options));
    } else if (options.method === 'post') {
      request = this.http.post(`${this.getUrl(url)}`, JSON.stringify(options));
    }
    return request.map((result: T[]) => {
      return result;
    }, (err) => {
      console.log(err);
      this.error.error(err);
    });
  }

  getPagedArrayList(options: PaginationRequest | any, url?: string) {
    let request: Observable<any>;
    if (!options.method) {
      request = this.http.get(`${this.getUrl(url)}`);
    } else if (options.method === 'get') {
      request = this.http.get(`${this.getUrl(url)}=` + JSON.stringify(options));
    } else if (options.method === 'post') {
      request = this.http.post(`${this.getUrl(url)}`, JSON.stringify(options));
    }
    return request.map((result: ListDataItem<T>) => {
      return result;
    }, (err) => {
      console.log(err);
      this.error.error(err);
    });
  }

  upload(fileItem: File, url: string, extraData?: object) {
    return this.http.upload(fileItem, this.getUrl(url), extraData).map((response: T) => {
      return response;
    }, (err) => {
      this.error.error(err);
    });
  }

}
