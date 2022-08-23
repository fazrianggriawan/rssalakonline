import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
    // { path: '', component: AppComponent },
    { path: '', loadChildren: () => import('./registrasi-online/registrasi-online.module').then(m => m.RegistrasiOnlineModule) },
    { path: 'anjungan', loadChildren: () => import('./anjungan/anjungan.module').then(m => m.AnjunganModule) },
    { path: 'caller', loadChildren: () => import('./caller/caller.module').then(m => m.CallerModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
