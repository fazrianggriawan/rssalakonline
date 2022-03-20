import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallerComponent } from './caller/caller.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SelfServiceComponent } from './self-service/self-service.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'caller', component: CallerComponent },
    { path: 'anjungan', component: SelfServiceComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
