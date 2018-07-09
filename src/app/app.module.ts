import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, 
    MatAutocompleteModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaskModule } from 'ngx-mask';
import { A2Edatetimepicker } from 'ng2-eonasdan-datetimepicker';
import { CoreModule } from './@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './auth/login/login.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatAutocompleteModule, MatCheckboxModule,
        HttpModule,
        AppRoutingModule,
        LoginModule,
        HttpClientModule,
        TimepickerModule.forRoot(),
        CoreModule.forRoot(),
        // FakeCoreModule.forRoot(),
        PaginationModule.forRoot(),
        FormsModule,
        A2Edatetimepicker,
        ReactiveFormsModule
    ],
    declarations: [AppComponent],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule { }
