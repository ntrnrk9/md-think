import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';

import { AppUser, UserInfo } from './@core/entities/authDataModel';
import { AuthService } from './@core/services';
import { SessionStorageService } from './@core/services/storage.service';
import { Observable } from 'rxjs/Observable';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    currentlyLoadingCount = this.router.events.scan((c, e) => this.countLoads(c, e), 0);
    constructor(private router: Router, private route: ActivatedRoute, private _storage: SessionStorageService, private _authService: AuthService) {}

    private countLoads(counter: number, event: any): number {
        if (this._storage.getItem('isDevice')) {
            return 0;
        }
        if (event instanceof RouteConfigLoadStart) {
            return counter + 1;
        }
        if (event instanceof RouteConfigLoadEnd) {
            return counter - 1;
        }
        return counter;
    }

    ngOnInit() {
        const id = this.route.snapshot.params['token'];
        const returnUrl = this.route.snapshot.params['returnUrl'];
        if (id && returnUrl) {
            const appUser = new AppUser();
            appUser.id = id;
            appUser.user = new UserInfo();
            this._storage.setObj('token', appUser);
            this._storage.setObj('isDevice', true);
            const encodedReturnUrl = decodeURIComponent(returnUrl);
            this._authService.populate(encodedReturnUrl);
        } else {
            this._authService.populate();
        }
    }
}
