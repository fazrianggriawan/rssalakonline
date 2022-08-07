import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DEFAULT_TIMEOUT, HttpProvider } from './providers/http.interceptor';

import { AppRoutingModule } from './app-routing.module';

import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { NgxHowlerService } from 'ngx-howler';
import { QrCodeModule } from "ng-qrcode";
import { NgxCaptureModule } from 'ngx-capture';

import { AppComponent } from './app.component';
import { LoadingComponent } from './anjungan/shared/components/loading/loading.component';

import { AnjunganModule } from './anjungan/anjungan.module';
import { RegistrasiOnlineModule } from './registrasi-online/registrasi-online.module';


@NgModule({
    declarations: [
        AppComponent,
        LoadingComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        ButtonModule,
        CalendarModule,
        BrowserModule,
        BrowserAnimationsModule,
        DropdownModule,
        SelectButtonModule,
        TableModule,
        QrCodeModule,
        RippleModule,
        DialogModule,
        ToastModule,
        NgxCaptureModule,
        AnjunganModule,
        RegistrasiOnlineModule
    ],
    providers: [
        NgxHowlerService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: HttpProvider, multi: true },
        { provide: DEFAULT_TIMEOUT, useValue: 50000 }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        ngxHowlerService: NgxHowlerService,
    ) {
        ngxHowlerService.loadScript('assets/howler/dist/howler.min.js');
    }
}
