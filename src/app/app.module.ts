import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TabViewModule } from "primeng/tabview";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { SidebarModule } from "primeng/sidebar";
import { DropdownModule } from 'primeng/dropdown';
import { CdkScrollableModule } from "@angular/cdk/scrolling";


@NgModule({
  declarations: [
    AppComponent
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
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
