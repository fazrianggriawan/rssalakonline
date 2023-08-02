import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-anjungan',
    templateUrl: './anjungan.component.html',
    styleUrls: ['./anjungan.component.css']
})
export class AnjunganComponent implements OnInit {

    isFirefox: boolean = true;

    constructor(
        public router: Router,
        private primeConfig: PrimeNGConfig,
    ) { }

    ngOnInit(): void {
        this.primeConfig.ripple = true;
        this.isFirefox = /firefox\//i.test(window.navigator.userAgent)
    }

}
