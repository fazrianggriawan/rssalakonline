import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallerComponent } from './caller/caller.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { JenisKunjunganComponent } from './registrasi-online/jenis-kunjungan/jenis-kunjungan.component';
import { KonfirmasiComponent } from './registrasi-online/konfirmasi/konfirmasi.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';
import { RencanaKunjunganComponent } from './registrasi-online/rencana-kunjungan/rencana-kunjungan.component';
import { SuccessComponent } from './registrasi-online/success/success.component';
import { SelfServiceComponent } from './self-service/self-service.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'registrasiOnline', component: RegistrasiOnlineComponent },
    { path: 'registrasiOnline/jenis-kunjungan', component: JenisKunjunganComponent },
    { path: 'registrasiOnline/rencana-kunjungan', component: RencanaKunjunganComponent },
    { path: 'registrasiOnline/konfirmasi', component: KonfirmasiComponent },
    { path: 'registrasiOnline/success', component: SuccessComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'caller', component: CallerComponent },
    { path: 'anjungan', component: SelfServiceComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
