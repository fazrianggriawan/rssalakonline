import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    errorMessage : any = '';

    constructor(
        private primengConfig: PrimeNGConfig
    ){}

    ngOnInit(): void {
        this.primengConfig.ripple = true;
    }

    hallo(){
        alert('asdasd')
    }

}

