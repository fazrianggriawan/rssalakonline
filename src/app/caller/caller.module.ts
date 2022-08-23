import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallerRoutingModule } from './caller-routing.module';
import { AntrianComponent } from './antrian/antrian.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';


@NgModule({
    declarations: [
        AntrianComponent
    ],
    imports: [
        CommonModule,
        CallerRoutingModule,
        FormsModule,
        TableModule
    ]
})
export class CallerModule { }
