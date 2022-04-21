import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getStatusPasien(){
    return this.http.get<any>(config.api('online/get/antrian'));
  }

  getPoliBpjs(){
    return this.http.get<any>(config.api('online/get/poli_bpjs'));
  }

  getAntrian(data:any){
    return this.http.post<any>(config.api('online/get/antrian'), data);
  }

  callAntrian(data:any){
    return this.http.post<any>(config.api('online/save/call_antrian'), data);
  }

  updateWaktuAntrian(data:any){
    return this.http.post<any>(config.api('online/save/update_waktu_antrian'), data);
  }

  constructor(
    private http: HttpClient
  ) { }
}
