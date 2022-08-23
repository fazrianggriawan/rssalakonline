import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: () => import('./registrasi/registrasi.module').then(m => m.RegistrasiModule) },
    { path: 'anjungan', loadChildren: () => import('./anjungan/anjungan.module').then(m => m.AnjunganModule) },
    { path: 'caller', loadChildren: () => import('./caller/caller.module').then(m => m.CallerModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
