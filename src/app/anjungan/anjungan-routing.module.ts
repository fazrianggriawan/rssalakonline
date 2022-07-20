import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnjunganComponent } from './anjungan.component';
import { RegistrasiOnlineComponent } from './registrasi-online/registrasi-online.component';

const routes: Routes = [
    { path: '', component: AnjunganComponent },
    { path: 'registrasiOnline', component: RegistrasiOnlineComponent },
    { path: 'tunai', component: RegistrasiOnlineComponent },
    { path: 'bpjs', component: RegistrasiOnlineComponent },
    { path: 'pasienBaru', component: RegistrasiOnlineComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnjunganRoutingModule { }
