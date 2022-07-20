import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnjunganRoutingModule } from './anjungan-routing.module';
import { AnjunganComponent } from './anjungan.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';
import { FormsModule } from '@angular/forms';
import { NumpadComponent } from './components/numpad/numpad.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';


@NgModule({
  declarations: [
    AnjunganComponent,
    NumpadComponent,
    KeyboardComponent,
    RegistrasiOnlineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AnjunganRoutingModule
  ]
})
export class AnjunganModule { }
