import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrasiRoutingModule } from './registrasi-routing.module';
import { RegistrasiComponent } from './registrasi.component';
import { FormsModule } from '@angular/forms';
import { JenisKunjunganComponent } from './jenis-kunjungan/jenis-kunjungan.component';
import { RencanaKunjunganComponent } from './rencana-kunjungan/rencana-kunjungan.component';
import { KonfirmasiComponent } from './konfirmasi/konfirmasi.component';
import { SuccessComponent } from './success/success.component';
import { QrCodeModule } from 'ng-qrcode';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { LoadingComponent } from './shared/loading/loading.component';
import { ErrorHandleComponent } from './shared/error-handle/error-handle.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    RegistrasiComponent,
    JenisKunjunganComponent,
    RencanaKunjunganComponent,
    KonfirmasiComponent,
    SuccessComponent,
    LoadingComponent,
    ErrorHandleComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    CalendarModule,
    FormsModule,
    RegistrasiRoutingModule,
    QrCodeModule,
    ToastModule
  ]
})
export class RegistrasiModule { }
