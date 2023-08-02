import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnjunganRoutingModule } from './anjungan-routing.module';
import { AnjunganComponent } from './anjungan.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BpjsComponent } from './bpjs/bpjs.component';
import { RujukanComponent } from './bpjs/rujukan/rujukan.component';
import { RippleModule } from 'primeng/ripple';
import { JadwalDokterComponent } from './bpjs/jadwal-dokter/jadwal-dokter.component';
import { KonfirmasiComponent } from './bpjs/konfirmasi/konfirmasi.component';
import { ToastModule } from 'primeng/toast';
import { NumpadComponent } from './shared/components/virtual-keyboard/numpad/numpad.component';
import { QwertyComponent } from './shared/components/virtual-keyboard/qwerty/qwerty.component';
import { ErrorHandleComponent } from './shared/components/error-handle/error-handle.component';
import { QrCodeModule } from 'ng-qrcode';
import { NomorAntrianComponent } from './nomor-antrian/nomor-antrian.component';
import { EsepComponent } from './esep/esep.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { BlockUIModule } from 'primeng/blockui';


@NgModule({
  declarations: [
    AnjunganComponent,
    NumpadComponent,
    RegistrasiOnlineComponent,
    BpjsComponent,
    QwertyComponent,
    RujukanComponent,
    JadwalDokterComponent,
    KonfirmasiComponent,
    ErrorHandleComponent,
    NomorAntrianComponent,
    EsepComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RippleModule,
    ToastModule,
    AnjunganRoutingModule,
    QrCodeModule,
    DialogModule,
    CalendarModule,
    BlockUIModule
  ],
  exports: [
    NumpadComponent
  ]
})
export class AnjunganModule { }
