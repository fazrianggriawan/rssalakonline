import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class AntrianService {

    dataPoli = new BehaviorSubject<any>([]);
    dataAntrian = new BehaviorSubject<any>([]);
    dataDashboard = new BehaviorSubject<any>([]);

    getPoliBpjs() {
        this.http.get<any>(config.api_vclaim('master/poli_bpjs'), { responseType: 'json' }).subscribe(res => {
            this.dataPoli.next(res.data);
        });
    }

    getAntrian(data: any) {
        this.http.post<any>(config.api_vclaim('antrian/filterData'), data).subscribe(res => {
            this.dataAntrian.next(res.data);
        });
    }

    callAntrian(data: any) {
        return this.http.post<any>(config.api_vclaim('antrian/callAntrian'), data);
    }

    updateWaktuAntrian(data: any) {
        this.http.post(config.api_vclaim('antrol/update_task_id'), data);
    }

    cancelAntrian(){
        this.http.get<any>(config.api('online/delete/cancel_antrian'), { responseType: 'json' });
    }

    getDataDashboard() {
        this.http.get<any>(config.api_vclaim('antrian/dashboard'), { responseType: 'json' })
            .subscribe(data => this.dataDashboard.next(data.data))
    }

    getBookingCode(bookingCode:string){
        return this.http.get<any>( config.api('anjungan/get/booking_code?booking_code='+bookingCode), {responseType: 'json'} );
    }

    terbilang(x:any, sen:boolean=false) {
        let res : any;
        let abil: any = [];

        if( sen == false ){
            abil = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
          }else{
            abil = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
          }

        if (x < 12) {
            res = " " + abil[x];
        } else if (x < 20) {
            res = this.terbilang(x - 10) + " belas";
        } else if (x < 100) {
            res = this.terbilang(Math.floor(x/10)) + " puluh" + this.terbilang(x % 10);
        } else if (x < 200) {
            res = " seratus" + this.terbilang(x - 100);
        } else if (x < 1000) {
            res = this.terbilang(x / 100) + " ratus" + this.terbilang(x % 100);
        } else if (x < 2000) {
            res = " seribu" + this.terbilang(x - 1000);
        } else if (x < 1000000){
            res = this.terbilang(x / 1000) + " ribu" + this.terbilang(x % 1000);
        } else if (x < 1000000000) {
            res = this.terbilang(x / 1000000) + " juta" + this.terbilang(x % 1000000);
        } else if (x < 1000000000000){
            res = this.terbilang(x / 1000000000) + " milyar" + this.terbilang(x % 1000000000);
        }

        return res;
    }

    constructor(
        private http: HttpClient
    ) { }
}
