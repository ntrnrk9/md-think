import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AlertModule } from '../../shared/modules/alert/alert.module';

@NgModule({
    imports: [CommonModule, LoginRoutingModule, FormsModule, AlertModule],
    declarations: [LoginComponent]
})
export class LoginModule {}
