import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnjunganComponent } from './anjungan.component';
import { BpjsComponent } from './bpjs/bpjs.component';
import { JadwalDokterComponent } from './bpjs/jadwal-dokter/jadwal-dokter.component';
import { KonfirmasiComponent } from './bpjs/konfirmasi/konfirmasi.component';
import { RujukanComponent } from './bpjs/rujukan/rujukan.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';

const routes: Routes = [
    { path: '', component: AnjunganComponent },
    { path: 'registrasiOnline', component: RegistrasiOnlineComponent },
    { path: 'anjungan/bpjs', component: BpjsComponent },
    { path: 'anjungan/bpjs/rujukan', component: RujukanComponent },
    { path: 'anjungan/bpjs/jadwalDokter', component: JadwalDokterComponent },
    { path: 'anjungan/bpjs/konfirmasi', component: KonfirmasiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnjunganRoutingModule { }
