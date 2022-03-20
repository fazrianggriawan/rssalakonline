import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class AntrianService {

    cancelAntrian(): Observable<any> {
        return this.http.get<any>(config.api_online('delete/cancel_antrian'), { responseType: 'json' });
    }

    getPoliBpjs() {
        return this.http.get<any>(config.api_online('get/poli_bpjs'), { responseType: 'json' });
    }

    getAntrian(data: any) {
        return this.http.post<any>(config.api_online('get/antrian'), data, { responseType: 'json' });
    }

    callAntrian(data: any) {
        return this.http.post<any>(config.api_online('save/call_antrian'), data, { responseType: 'json' });
    }

    updateWaktuAntrian(data: any) {
        return this.http.post<any>(config.api_online('save/update_waktu_antrian'), data, { responseType: 'json' });
    }

    getDataDashboard() {
        return this.http.get<any>(config.api_online('get/data_dashboard'), { responseType: 'json' });
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
