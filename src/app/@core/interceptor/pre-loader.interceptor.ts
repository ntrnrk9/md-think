import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpResponse,
    HttpEvent,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
declare var $: any;

@Injectable()
export class PreLoaderInterceptor implements HttpInterceptor {
    private callCount = 0;
    constructor() {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.headers.get('ctype') !== 'file') {
            this.showBusyLoader();
            this.callCount++;
            return next.handle(request).do(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.callCount--;
                        if (this.callCount === 0) {
                            this.hideBusyLoader();
                        }
                    }
                },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        this.callCount--;
                        if (this.callCount === 0) {
                            this.hideBusyLoader();
                        }
                    }
                }
            );
        }
        return next.handle(request);
    }

    showBusyLoader() {
        $('#loaderAnimation').show();
    }

    hideBusyLoader() {
        $('#loaderAnimation')
            .fadeOut('slow')
            .hide();
    }
}
