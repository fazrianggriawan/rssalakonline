import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrasiComponent } from './registrasi/registrasi.component';

const routes: Routes = [
    { path: '', component: RegistrasiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrasiOnlineRoutingModule { }
