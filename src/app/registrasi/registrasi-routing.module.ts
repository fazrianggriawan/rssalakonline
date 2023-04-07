import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JenisKunjunganComponent } from './jenis-kunjungan/jenis-kunjungan.component';
import { KonfirmasiComponent } from './konfirmasi/konfirmasi.component';
import { RegistrasiComponent } from './registrasi.component';
import { RencanaKunjunganComponent } from './rencana-kunjungan/rencana-kunjungan.component';
import { SuccessComponent } from './success/success.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';

const moduleName: string = 'registrasi'

const routes: Routes = [
    { path: '', component: RegistrasiComponent },
    { path: moduleName+'/jenis-kunjungan', component: JenisKunjunganComponent },
    { path: moduleName+'/rencana-kunjungan', component: RencanaKunjunganComponent },
    { path: moduleName+'/konfirmasi', component: KonfirmasiComponent },
    { path: moduleName+'/success', component: SuccessComponent },
    { path: moduleName+'/view-booking/:kode_booking', component: ViewBookingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrasiRoutingModule { }
