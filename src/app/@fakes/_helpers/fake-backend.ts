import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import * as user from '../_data/users.json';
import * as permissions from '../_data/permissions.json';
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        // wrap in delayed observable to simulate server api call
        return Observable.of(null).mergeMap(() => {

            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: <any>user }));
            }

            if (request.url.endsWith('/permission') && request.method === 'POST') {
                return Observable.of(new HttpResponse({ status: 200, body: <any>permissions }));
            }
            // pass through any requests not handled above
            return next.handle(request);
        })

            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .materialize()
            .delay(500)
            .dematerialize();
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
