import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { hasMatch } from '../common/initializer';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.checkActivation(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.checkActivation(route, state);
    }

    private checkActivation(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.currentUser.map(user => {
            if (route.data && route.data.screen && route.data.screen.current) {
                if (!hasMatch([route.data.screen.current], user.resources.map(item => item.name))) {
                    this.router.navigate(['access-denied']);
                    return false;
                }
                return true;
            }
            return true;
        });
    }
}
