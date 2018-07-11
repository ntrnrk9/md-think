import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard, SeoGuard } from './@core/guard';
import { LoginComponent } from './auth/login/login.component';
import { NoAuthGuard } from './@core/guard/no-auth-guard.service';

const routes: Routes = [
    {
        path: '',
        loadChildren: './pages/pages.module#PagesModule',
        canActivate: [SeoGuard],
        data: {
            title: ['DHS Login'],
            desc: 'Maryland department of human services'
        }
    },
    {
        path: 'devices/:token/:returnUrl',
        component: AppComponent
    },
    {
        path: 'pages',
        loadChildren: './pages/pages.module#PagesModule',
        canActivate: [AuthGuard, SeoGuard],
        data: {
            title: ['DHS Home'],
            desc: 'Maryland department of human services'
        }
    },
    {
        path: 'login',
        loadChildren: './auth/login/login.module#LoginModule',
        canActivate: [SeoGuard],
        data: {
            title: ['DHS Login'],
            desc: 'Maryland department of human services'
        }
    },
    {path: 'pdf', loadChildren: './shared/pages/cjams-pdf/cjams-pdf.module#CjamsPdfModule'},
    { path: 'error', loadChildren: './shared/pages/server-error/server-error.module#ServerErrorModule' },
    { path: 'access-denied', loadChildren: './shared/pages/access-denied/access-denied.module#AccessDeniedModule' },
    { path: 'not-found', loadChildren: './shared/pages/not-found/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
