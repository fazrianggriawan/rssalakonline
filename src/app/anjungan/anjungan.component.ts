import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ErrorService } from '../services/error.service';

@Component({
    selector: 'app-anjungan',
    templateUrl: './anjungan.component.html',
    styleUrls: ['./anjungan.component.css']
})
export class AnjunganComponent implements OnInit {

    constructor(
        public router: Router,
        private primeConfig: PrimeNGConfig,
        private errorService: ErrorService
    ) { }

    ngOnInit(): void {
        this.primeConfig.ripple = true;
    }

}
