import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallerRoutingModule } from './caller-routing.module';
import { AntrianComponent } from './antrian/antrian.component';


@NgModule({
  declarations: [
    AntrianComponent
  ],
  imports: [
    CommonModule,
    CallerRoutingModule
  ]
})
export class CallerModule { }
