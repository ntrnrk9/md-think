import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorInfo } from '../../@core/common/errorDisplay';
import { AuthService } from '../../@core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../@core/services';
import { UserLogin } from '../../@core/entities/authDataModel';
@Component({
    // moduleId: module.id,
    // tslint:disable-next-line:component-selector
    selector: 'login',
    styleUrls: ['./login.component.scss'],
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    show = false;
    user: UserLogin = new UserLogin();
    error: ErrorInfo = new ErrorInfo();
    @ViewChild('showhideinput') input;
    constructor(private authService: AuthService, private _alertService: AlertService) {}

    ngOnInit() {}
    login(user: UserLogin) {
        this.authService.login(this.user.email, this.user.password).subscribe(
            (response) => {
                if (response && response.id && response.role) {
                    this.authService.roleBasedRoute(response.role.name.toLowerCase());
                } else {
                    this._alertService.error('User roles are not mapped for this user to access this application. Please contact your site admin.');
                }
            },
            (err) => {
                if (err.error && err.error.error && err.error.error.code) {
                    if (err.error.error.code === 'LOGIN_FAILED') {
                        this._alertService.warn('Invalid email or password.');
                    } else if (err.error.error.code === 'USERNAME_EMAIL_REQUIRED') {
                        this._alertService.warn('Email or password should not be empty!');
                    } else {
                        this._alertService.error('Unable to login, please try again.');
                        this.error.error(err);
                    }
                } else {
                    this._alertService.error('Unable to login, please try again.');
                }
            }
        );
    }

    toggleShow() {
        this.show = !this.show;
        if (this.show) {
            this.input.nativeElement.type = 'text';
        } else {
            this.input.nativeElement.type = 'password';
        }
    }
}
