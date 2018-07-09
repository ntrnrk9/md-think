import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from '../@core/guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [RoleGuard],
        children: [
            { path: 'admin', loadChildren: '' },
            { path: 'new', loadChildren: '' },
            { path: 'newintake', loadChildren: './newintake/newintake.module#NewintakeModule' },
            { path: 'manage', loadChildren: '' },
            { path: 'find', loadChildren: '' },
            { path: 'case-worker', loadChildren: '' },
            { path: 'home-dashboard', loadChildren: '' },
            { path: 'calendar', loadChildren: '' },
            { path: 'notification', loadChildren: '' },
            { path: 'report', loadChildren: '' },
            { path: 'resource', loadChildren: '' },
            { path: 'help', loadChildren: '' }
        ],
        data: {
            screen: { modules: [ 'pages', 'menus'], skip: false }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
