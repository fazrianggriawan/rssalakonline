import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntrianComponent } from './antrian/antrian.component';

const routes: Routes = [
    { path: '', component: AntrianComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallerRoutingModule { }
