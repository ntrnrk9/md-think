import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { PageHeaderModule } from '../shared/modules';
import { FieldPermissionDirective } from '../@core/directives/field-permission.directive';
import { AlertModule } from '../shared/modules/alert/alert.module';
import { AuthErrorHandler } from '../@core/handler/auth-error.handler';

@NgModule({
    imports: [CommonModule, PagesRoutingModule, PageHeaderModule, AlertModule],
    declarations: [FieldPermissionDirective, PagesComponent],
    exports: [FieldPermissionDirective]
})
export class PagesModule {}
