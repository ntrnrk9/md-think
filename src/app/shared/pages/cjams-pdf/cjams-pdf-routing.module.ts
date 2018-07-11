import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CjamsPdfComponent } from './cjams-pdf.component';

const routes: Routes = [{
  path: '',
  component: CjamsPdfComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CjamsPdfRoutingModule { }
