import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AnjunganService {

  panelStatus = new BehaviorSubject<any>(false);
  panel = {
    bpjs: new BehaviorSubject<any>(false),
    tunai: new BehaviorSubject<any>(false),
    pasienBaru: new BehaviorSubject<any>(false),
    online: new BehaviorSubject<any>(false)
  }

  getPanelStatus(){
    return this.panelStatus.asObservable();
  }

  getPanelStatusOnline(){
    return this.panel.online.asObservable();
  }

  getPanelStatusBpjs(){
    return this.panel.bpjs.asObservable();
  }

  getPanelStatusTunai(){
    return this.panel.tunai.asObservable();
  }

  getPanelStatusPasienbaru(){
    return this.panel.pasienBaru.asObservable();
  }

  getBookingCode(bookingCode:string){
    return this.http.get<any>( config.api('anjungan/get/booking_code?booking_code='+bookingCode), {responseType: 'json'} );
  }

  constructor(
    private http: HttpClient
  ) { }
}
