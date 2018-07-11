import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfHeaderComponent } from './pdf-header/pdf-header.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PdfHeaderComponent],
  exports: [PdfHeaderComponent]
})
export class PdfDesignModule { }
