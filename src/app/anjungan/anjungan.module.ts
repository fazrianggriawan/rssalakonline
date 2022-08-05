import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnjunganRoutingModule } from './anjungan-routing.module';
import { AnjunganComponent } from './anjungan.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';
import { FormsModule } from '@angular/forms';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { BpjsComponent } from './bpjs/bpjs.component';
import { QwertyComponent } from './components/virtual-keyboard/qwerty/qwerty.component';
import { NumpadComponent } from './components/virtual-keyboard/numpad/numpad.component';
import { RujukanComponent } from './bpjs/rujukan/rujukan.component';
import { RippleModule } from 'primeng/ripple';
import { JadwalDokterComponent } from './bpjs/jadwal-dokter/jadwal-dokter.component';
import { KonfirmasiComponent } from './bpjs/konfirmasi/konfirmasi.component';
import { ToastModule } from 'primeng/toast';
import { ErrorHandleComponent } from './components/error-handle/error-handle.component';


@NgModule({
  declarations: [
    AnjunganComponent,
    NumpadComponent,
    KeyboardComponent,
    RegistrasiOnlineComponent,
    BpjsComponent,
    QwertyComponent,
    RujukanComponent,
    JadwalDokterComponent,
    KonfirmasiComponent,
    ErrorHandleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RippleModule,
    ToastModule,
    AnjunganRoutingModule
  ],
  exports: [
    NumpadComponent
  ]
})
export class AnjunganModule { }
