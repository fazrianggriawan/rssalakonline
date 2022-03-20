import { Component, OnInit } from '@angular/core';
import { AntrianService } from '../services/antrian.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataDashboard: any[] = [];
  info_antrian: any = {tanggal: '', info: ''};

  getDataDashboard() {
    this.antrianService.getDataDashboard().subscribe(data => {
      if( data.response.data ){
        this.dataDashboard = data.response.data;
      }

      this.info_antrian = data.response.info;

    })
  }

  constructor(
    private antrianService: AntrianService
  ) { }

  ngOnInit(): void {
    this.getDataDashboard();
    setInterval(() => {
      this.getDataDashboard();
    }, 5000);
  }

}
