import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DEFAULT_TIMEOUT, HttpProvider } from './providers/http.interceptor';
import { CdkScrollableModule } from "@angular/cdk/scrolling";

import { AppRoutingModule } from './app-routing.module';

import { TabViewModule } from "primeng/tabview";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { SidebarModule } from "primeng/sidebar";
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MatButtonModule } from '@angular/material/button';

import { NgxHowlerService } from 'ngx-howler';
import { QrCodeModule } from "ng-qrcode";
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { CallerComponent } from './caller/caller.component';
import { SelfServiceComponent } from './self-service/self-service.component';

import { PasienBaruComponent } from './panel/pasien-baru/pasien-baru.component';
import { UmumComponent } from './panel/umum/umum.component';
import { BpjsComponent } from './panel/bpjs/bpjs.component';
import { OnlineComponent } from './panel/online/online.component';
import { PerawatComponent } from './panel/perawat/perawat.component';
import { CariPesertaComponent } from './shared/components/cari-peserta/cari-peserta.component';
import { DataPesertaComponent } from './shared/components/data-peserta/data-peserta.component';
import { DataRujukanComponent } from './shared/components/data-rujukan/data-rujukan.component';
import { DataSuratKontrolComponent } from './shared/components/data-surat-kontrol/data-surat-kontrol.component';
import { DataHistorySepComponent } from './shared/components/data-history-sep/data-history-sep.component';
import { KonfirmasiDataComponent } from './shared/components/konfirmasi-data/konfirmasi-data.component';
import { PilihJenisKunjunganComponent } from './shared/components/pilih-jenis-kunjungan/pilih-jenis-kunjungan.component';
import { JadwalDokterComponent } from './shared/components/jadwal-dokter/jadwal-dokter.component';
import { KeyboardComponent } from './shared/components/keyboard/keyboard.component';
import { NumpadComponent } from './shared/components/numpad/numpad.component';
import { CariBookingOnlineComponent } from './shared/components/cari-booking-online/cari-booking-online.component';
import { LoadingComponent } from './shared/components/loading/loading.component';

@NgModule({
    declarations: [
        AppComponent,
        CallerComponent,
        DashboardComponent,
        HomeComponent,
        SelfServiceComponent,
        PasienBaruComponent,
        UmumComponent,
        BpjsComponent,
        OnlineComponent,
        PerawatComponent,
        CariPesertaComponent,
        DataPesertaComponent,
        DataRujukanComponent,
        DataSuratKontrolComponent,
        DataHistorySepComponent,
        KonfirmasiDataComponent,
        PilihJenisKunjunganComponent,
        JadwalDokterComponent,
        KeyboardComponent,
        NumpadComponent,
        CariBookingOnlineComponent,
        LoadingComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TabViewModule,
        ButtonModule,
        CalendarModule,
        BrowserModule,
        BrowserAnimationsModule,
        SidebarModule,
        CdkScrollableModule,
        DropdownModule,
        SelectButtonModule,
        TableModule,
        QrCodeModule,
        RippleModule,
        DialogModule,
        MatButtonModule,
        MatKeyboardModule,
        ToastModule,
        ConfirmDialogModule
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
