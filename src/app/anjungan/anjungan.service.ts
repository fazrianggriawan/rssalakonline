import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';

@Injectable({
    providedIn: 'root'
})
export class AnjunganService {

    registrasiOnline = new BehaviorSubject<any>('');
    peserta = new BehaviorSubject<any>('');
    sep = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient
    ) { }

    getBookingCode(bookingCode: string) {
        this.http.get<any>(config.api_vclaim('antrian/kodeBooking/' + bookingCode))
            .subscribe(data => {
                if (data.code == 200) {
                    this.registrasiOnline.next(data.data)
                }
            });
    }

    getPeserta(noKartuBpjs: string) {
        this.http.get<any>(config.api_vclaim('peserta/nomorKartu/' + noKartuBpjs))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.peserta.next(data.response.peserta);
                }
            })
    }

    createSep(data: any) {
        this.sep.next('');
        this.http.post<any>(config.api_vclaim('sep/save'), data)
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.sep.next(data.response.sep);
                }else{
                    alert(data.metaData.message+' Hubungi loket pendaftaran untuk mendapatkan bantuan.');
                }
            })
    }

    dateHuman(date: string) {
        let tanggal = date.split('-');
        let arrBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        let bulan = parseInt(tanggal[1]) - 1
        return tanggal[2] + ' ' + arrBulan[bulan] + ' ' + tanggal[0];
    }

}
