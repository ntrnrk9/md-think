import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewintakeComponent } from './newintake.component';
import { NewSaveintakeComponent } from './new-saveintake/new-saveintake.component';
import { RoleGuard } from '../../@core/guard/role.guard';

const routes: Routes = [
    {
        path: '',
        component: NewintakeComponent,
        canActivate: [RoleGuard],
        children: [
            {
                path: 'my-newintake',
                loadChildren: './my-newintake/my-newintake.module#MyNewintakeModule'
            }
        ]
    },
    {
        path: 'new-saveintake',
        component: NewSaveintakeComponent,
        canActivate: [RoleGuard],
        data: {
            title: ['DHS - Saved Intakes'],
            desc: 'Maryland department of human services',
            screen: { current: 'new', modules: [], skip: false }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewintakeRoutingModule {}
