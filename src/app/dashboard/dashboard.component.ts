import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { RegistrasiService } from '../services/registrasi.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataAntrian : any[] = [];
  dataPoli : any[] = [];
  dataJadwalPraktek : any[] = [];
  tglKunjungan : Date = new Date();
  selectedPoli : any = {};
  selectedJadwal : any = {};
  nextCall : string = '';
  lastCall : any = {};
  dataCalled : any = [];

  dataDashboard : any[] = [
      { 'prefix': 'A1', 'nama': 'ANAK' },
      { 'prefix': 'A2', 'nama': 'ANASTESI' },
      { 'prefix': 'A3', 'nama': 'BEDAH' },
      { 'prefix': 'A4', 'nama': 'BEDAH MULUT' },
      { 'prefix': 'A5', 'nama': 'BEDAH PLASTIK' },
      { 'prefix': 'A6', 'nama': 'GERIATRI' },
      { 'prefix': 'A7', 'nama': 'PENYAKIT DALAM' },
      { 'prefix': 'A8', 'nama': 'JANTUNG' },
      { 'prefix': 'A9', 'nama': 'PENYAKIT JIWA' },
      { 'prefix': 'B1', 'nama': 'KULIT KELAMIN' },
      { 'prefix': 'B1', 'nama': 'MATA' },
      { 'prefix': 'B3', 'nama': 'OBGYN' },
      { 'prefix': 'B4', 'nama': 'ORTHOPEDI' },
      { 'prefix': 'B5', 'nama': 'PARU' },
      { 'prefix': 'B6', 'nama': 'REHABILITASI MEDIK' },
      { 'prefix': 'B7', 'nama': 'SARAF' },
      { 'prefix': 'B8', 'nama': 'THT' },
      { 'prefix': 'B9', 'nama': 'UMUM' },
      { 'prefix': 'C1', 'nama': 'UROLOGI' },
  ];

  getDataPoli(){
    this.dashboardService.getPoliBpjs().subscribe(data => {
      this.dataPoli = data.data;
    })
  }

  getAntrian(){
    let data = {
      tgl : this.tglKunjungan.toLocaleDateString(),
      poli : this.selectedPoli.kode,
      jadwal : this.selectedJadwal.jadwal
    }
    this.dashboardService.getAntrian(data).subscribe(data => {
      this.dataAntrian = [];
      this.dataCalled = [];
      this.lastCall = {};
      this.nextCall = '';

      if( data.data.length > 0 ){
        let dataAntrian : any[] = data.data;
        let lastIdxCalled : any = '';
        dataAntrian.forEach((element, index) => {
          if( element.call_time ){
            this.dataCalled.push(element);
            lastIdxCalled = index;
          }else{
            this.dataAntrian.push(element);
          }
        });
        if( this.dataCalled[lastIdxCalled] ){
          this.lastCall = this.dataCalled[lastIdxCalled];
        }

        if(this.dataAntrian[0]){
          this.nextCall = this.dataAntrian[0].prefix_antrian + '-' + this.dataAntrian[0].no_antrian;
        }
      }
    })
  }

  getJadwalDokter(){
    if( this.tglKunjungan && this.selectedPoli.kode ){
      let data = {
        tgl : this.tglKunjungan.toLocaleDateString(),
        poli : this.selectedPoli.kode
      }
      this.registrasiService.getJadwalDokter(data).subscribe(data => {
        this.dataJadwalPraktek = data.response;
      })
    }
  }

  callNext(){
    if( this.nextCall == '' ){
      alert('Tidak ada data dalam antrian');
    }else{
      if( confirm('Yakin ingin memanggil ?') ){
        let data = {
          id_antrian : this.dataAntrian[0].id,
          kodebooking : this.dataAntrian[0].booking_code
        };
        this.dashboardService.callAntrian(data).subscribe(data => {
          if( data.code == '200' ){
            this.updateWaktuAntrian(4);
            this.getAntrian();
          }
        })
      }
    }
  }

  updateWaktuAntrian(taskId:any){
    let booking_code : string = '';
    if( this.dataAntrian[0] ){
      booking_code = this.dataAntrian[0].booking_code;
    }else{
      booking_code = this.lastCall.booking_code;
    }
    let data = {
      kodebooking : booking_code,
      taskid: taskId
    };
    this.dashboardService.updateWaktuAntrian(data).subscribe(data => {
      alert(data.metadata.message);
    })
  }

  constructor(
    public dashboardService: DashboardService,
    public registrasiService: RegistrasiService,
  ) { }

  ngOnInit(): void {
    this.getDataPoli();
  }

}
