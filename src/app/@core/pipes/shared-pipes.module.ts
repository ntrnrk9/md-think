import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByPipe } from './orderby.pipe';
import { ValidDateFormatPipe } from './custom-date.pipe';
import { KeysPipe } from './array-keys.pipe';
import { NoDataDisplayPipe } from './table-no-data.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ValidDateFormatPipe, OrderByPipe, KeysPipe, NoDataDisplayPipe],
    exports: [ValidDateFormatPipe, OrderByPipe, KeysPipe, NoDataDisplayPipe],
    providers: [ValidDateFormatPipe, OrderByPipe, KeysPipe, NoDataDisplayPipe]
})
export class SharedPipesModule { }
