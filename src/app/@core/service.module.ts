import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthErrorHandler } from './handler/auth-error.handler';
import { AuthTokenInterceptor } from './interceptor/auth-token.interceptor';
import { JsonContentTypeHeaderInterceptor } from './interceptor/json-content-type.interceptor';
import { PreLoaderInterceptor } from './interceptor/pre-loader.interceptor';
import {
    AlertService,
    AuthService,
    CacheService,
    DataStoreService,
    GenericService,
    LocalStorageService,
    SeoService,
    SessionStorageService,
} from './services';
import { CommonHttpService } from './services/common-http.service';
import { HttpService } from './services/http.service';

// Services
const SERVICES = [AuthService, CacheService, HttpService, GenericService, CommonHttpService, LocalStorageService, SessionStorageService, SeoService, AlertService, DataStoreService];

@NgModule({
    imports: [CommonModule],
    providers: [...SERVICES]
})
export class ServiceModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ServiceModule,
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: JsonContentTypeHeaderInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: PreLoaderInterceptor, multi: true },
                { provide: ErrorHandler, useClass: AuthErrorHandler, multi: false },
                ...SERVICES
            ]
        };
    }
}
