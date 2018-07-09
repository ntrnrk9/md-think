import 'rxjs/Rx';

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { AppConfig } from '../../app.config';
import { AppUser } from '../entities/authDataModel';
import { DataStoreService } from './data-store.service';
import { HttpService } from './http.service';
import { SessionStorageService } from './storage.service';

@Injectable()
export class AuthService {
    private currentUserSubject = new BehaviorSubject<AppUser>({} as AppUser);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    constructor(private location: Location, private storage: SessionStorageService, private http: HttpService, private router: Router, private _storeService: DataStoreService) {}

    // Verify JWT in localstorage with server & load user's info.
    // This runs once on application startup.
    public populate(returnUrl: string = '') {
        if (this.location.path().indexOf('/devices/') !== -1) {
            if (this.storage.getObj('isDevice')) {
                const token = this.storage.getObj('token') as AppUser;
                this.http.get(AppConfig.roleProfileUrl).subscribe((user: AppUser) => {
                    token.role = user.role;
                    token.resources = user.resources;
                    this.isAuthenticatedSubject.next(true);
                    const tokenInfo = Object.assign(token, user);
                    this.currentUserSubject.next(tokenInfo);
                    this.storage.setObj('token', tokenInfo);
                    this.router.navigate([returnUrl]);
                });
            }
        } else {
            const token = this.storage.getObj('token') as AppUser;
            if (!token) {
                this.currentUserSubject.next({} as AppUser);
                // Set auth status to false
                this.isAuthenticatedSubject.next(false);
                // Remove any potential remnants of previous auth states
                this.router.navigate(['login']);
            } else {
                const currentUser = this.getCurrentUser();
                if (Object.keys(currentUser).length === 0) {
                    this.http.get(AppConfig.roleProfileUrl).subscribe((user: AppUser) => {
                        token.role = user.role;
                        token.resources = user.resources;
                        this.isAuthenticatedSubject.next(true);
                        this.currentUserSubject.next(Object.assign(token, user));
                        if (this.location.path() !== '') {
                            this.router.navigate([this.location.path()]);
                        } else {
                            if (user && user.id && user.role) {
                                this.roleBasedRoute(user.role.name.toLowerCase());
                            }
                        }
                    });
                }
            }
        }
    }

    public login(email: string, password: string): Observable<AppUser> {
        return this.http.post(AppConfig.authTokenUrl, JSON.stringify({ email: email.toLowerCase(), password: password, fromdevice: 1 })).flatMap((token: AppUser) => {
            this.storage.setObj('token', token);
            this.isAuthenticatedSubject.next(true);
            return this.http.get(AppConfig.roleProfileUrl).map((user: AppUser) => {
                token.role = user.role;
                token.resources = user.resources;
                this.currentUserSubject.next(Object.assign(token, user));
                return token;
            });
        });
    }

    public logout() {
        return this.http.post(AppConfig.logoutUrl).subscribe(
            (response) => {
                console.log(response);
                this.storage.removeItem('token');
                this.router.routeReuseStrategy.shouldReuseRoute = function() {
                    return false;
                };
                const currentUrl = 'login';
                this.router.navigateByUrl(currentUrl).then(() => {
                    this.isAuthenticatedSubject.next(false);
                    this.currentUserSubject.next({} as AppUser);
                    this._storeService.clearStore();
                    this.router.navigated = false;
                    this.router.navigate([currentUrl], { replaceUrl: true });
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }

    public getCurrentUser(): AppUser {
        return this.currentUserSubject.value;
    }

    public isDevice(): boolean {
        return this.storage.getObj('isDevice');
    }

    public roleBasedRoute(roleName: string) {
        if (roleName === 'superuser') {
            this.router.navigate(['/pages/newintake/new-saveintake']);
            // this.router.navigate(['/pages/home-dashboard']);
        } else if (roleName === 'field') {
            this.router.navigate(['/pages/home-dashboard']);
        } else if (roleName === 'apcs') {
            // this.router.navigate(['/pages/case-worker']);
            this.router.navigate(['/pages/cjams-dashboard']);
        } else if (roleName === 'provider') {
            // this.router.navigate(['/pages/case-worker']);
            this.router.navigate(['/pages/cjams-dashboard']);
        } else if (roleName === 'cru') {
            this.router.navigate(['/pages/newintake/new-saveintake']);
        } else if (roleName === 'ASCW') {
            this.router.navigate(['/pages/newintake/new-saveintake']);
        } else {
            // this.router.navigate(['/pages/home-dashboard']);
            this.router.navigate(['/pages/newintake/new-saveintake']);
        }
    }
}
