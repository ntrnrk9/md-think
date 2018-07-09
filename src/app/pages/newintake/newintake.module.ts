import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';

import { SharedDirectivesModule } from '../../@core/directives/shared-directives.module';
import { SharedPipesModule } from '../../@core/pipes/shared-pipes.module';
import { NewSaveintakeComponent } from './new-saveintake/new-saveintake.component';
import { NewintakeRoutingModule } from './newintake-routing.module';
import { NewintakeComponent } from './newintake.component';

@NgModule({
    imports: [CommonModule, NewintakeRoutingModule, FormsModule, ReactiveFormsModule, PaginationModule, SharedDirectivesModule, SharedPipesModule],
    declarations: [NewintakeComponent, NewSaveintakeComponent]
})
export class NewintakeModule {}
