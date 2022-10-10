import { Component, OnInit } from '@angular/core';
import { AntrianService } from '../services/antrian.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    dataDashboard: any[] = [];
    info_antrian: any = { tanggal: '', info: '' };

    constructor(
        private antrianService: AntrianService
    ) { }

    ngOnInit(): void {

        this.antrianService.dataDashboard.subscribe(data => {
            if(data){
                this.dataDashboard = data.antrian;
                this.info_antrian = data.info;
            }
        })

        setInterval(() => {
            this.antrianService.getDataDashboard()
        }, 5000);
    }

}
