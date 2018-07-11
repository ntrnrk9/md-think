import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CjamsPdfRoutingModule } from './cjams-pdf-routing.module';
import { CjamsPdfComponent } from './cjams-pdf.component';

@NgModule({
  imports: [
    CommonModule,
    CjamsPdfRoutingModule
  ],
  declarations: [CjamsPdfComponent]
})
export class CjamsPdfModule { }
