import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { hasMatch } from '../../../@core/common/initializer';
import { AppUser } from '../../../@core/entities/authDataModel';
import { AuthService, CommonHttpService } from '../../../@core/services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass = 'push-right';
    userInfo: AppUser;
    today = Date.now();
    role = '';
    totalNotificationCount = 10;
    showNotification = false;
    constructor(public router: Router, private _authService: AuthService, private _service: CommonHttpService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.userInfo = this._authService.getCurrentUser();
        if (this.userInfo) {
            if (this.userInfo.role) {
                this.role = this.userInfo.role.name;
            }
        } else {
            this.router.navigate(['login']);
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this._authService.logout();
    }

    hasAccess(key: string): Observable<boolean> {
        return this._authService.currentUser.map((user) => {
            if (key && user.resources) {
                if (!hasMatch([key], user.resources.map((item) => item.name))) {
                    return false;
                }
                return true;
            }
            return true;
        });
    }
    clearCount() {
        this.showNotification = false;
    }

    getNotificationCount(pageNo) {
        this._service.endpointUrl = 'Usernotifications/getUserNotificationCount';
        this._service.getArrayList({}).subscribe((data) => {
            this.totalNotificationCount = data['count'];
            if (data['count'] !== '0') {
                this.showNotification = true;
            }
        });
    }
}
