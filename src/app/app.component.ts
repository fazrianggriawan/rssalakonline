import { Component, OnInit } from '@angular/core';
import { ErrorService } from './services/error.service';
import { PrimeNGConfig } from 'primeng/api';
import { RegistrasiOnlineService } from './registrasi-online/registrasi-online.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    errorMessage : any = '';

    constructor(
        private errorService: ErrorService,
        private primengConfig: PrimeNGConfig
    ){}

    ngOnInit(): void {
        // Listen To Error Message
        this.errorService.getErrorStatus().subscribe(err => {
            if( err ){
                this.errorMessage = 'Something bad happened, please try again later. ('+JSON.stringify(err)+')';
                setTimeout(() => {
                    this.errorMessage = false;
                }, 5000);
            }
        })
        this.primengConfig.ripple = true;
    }

}

