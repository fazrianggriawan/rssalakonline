import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TabViewModule } from "primeng/tabview";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { SidebarModule } from "primeng/sidebar";
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';


import { CdkScrollableModule } from "@angular/cdk/scrolling";
import { CallerComponent } from './caller/caller.component';
import { NgxHowlerService } from 'ngx-howler';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

import { DEFAULT_TIMEOUT, Timeout } from "./timeout";


@NgModule({
    declarations: [
        AppComponent,
        CallerComponent,
        DashboardComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TabViewModule,
        ButtonModule,
        CalendarModule,
        BrowserModule,
        BrowserAnimationsModule,
        SidebarModule,
        CdkScrollableModule,
        DropdownModule,
        SelectButtonModule,
        TableModule
    ],
    providers: [
        NgxHowlerService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: Timeout, multi: true },
        { provide: DEFAULT_TIMEOUT, useValue: 10000 }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        ngxHowlerService: NgxHowlerService
    ) {
        ngxHowlerService.loadScript('assets/howler/dist/howler.min.js');
    }
}
