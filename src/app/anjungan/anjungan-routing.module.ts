import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnjunganComponent } from './anjungan.component';
import { BpjsComponent } from './bpjs/bpjs.component';
import { JadwalDokterComponent } from './bpjs/jadwal-dokter/jadwal-dokter.component';
import { KonfirmasiComponent } from './bpjs/konfirmasi/konfirmasi.component';
import { RujukanComponent } from './bpjs/rujukan/rujukan.component';
import { NomorAntrianComponent } from './nomor-antrian/nomor-antrian.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';

let moduleName : string = 'anjungan';

const routes: Routes = [
    { path: '', component: AnjunganComponent },
    { path: moduleName+'/registrasi-online', component: RegistrasiOnlineComponent },
    { path: moduleName+'/nomor-antrian', component: NomorAntrianComponent },
    { path: moduleName+'/bpjs', component: BpjsComponent },
    { path: moduleName+'/bpjs/rujukan', component: RujukanComponent },
    { path: moduleName+'/bpjs/jadwalDokter', component: JadwalDokterComponent },
    { path: moduleName+'/bpjs/konfirmasi', component: KonfirmasiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnjunganRoutingModule { }
