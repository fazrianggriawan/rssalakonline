import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrasiOnlineRoutingModule } from './registrasi-online-routing.module';
import { RegistrasiComponent } from './registrasi/registrasi.component';


@NgModule({
  declarations: [
    RegistrasiComponent
  ],
  imports: [
    CommonModule,
    RegistrasiOnlineRoutingModule
  ]
})
export class RegistrasiOnlineModule { }
