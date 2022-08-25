import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnjunganRoutingModule } from './anjungan-routing.module';
import { AnjunganComponent } from './anjungan.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';
import { FormsModule } from '@angular/forms';
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
    NomorAntrianComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RippleModule,
    ToastModule,
    AnjunganRoutingModule,
    QrCodeModule
  ],
  exports: [
    NumpadComponent
  ]
})
export class AnjunganModule { }
