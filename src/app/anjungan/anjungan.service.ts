import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { ErrorMessageService } from '../services/error-message.service';

@Injectable({
    providedIn: 'root'
})
export class AnjunganService {

    registrasiOnline = new BehaviorSubject<any>('');
    registrasiOnlineAndroid = new BehaviorSubject<any>('');
    peserta = new BehaviorSubject<any>('');
    sep = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient,
        private errorMessage: ErrorMessageService
    ) { }

    getBookingCode(bookingCode: string) {
        this.http.get<any>(config.api_vclaim('antrian/kodeBooking/' + bookingCode))
            .subscribe(data => {
                if (data.code == 200) {
                    this.registrasiOnline.next(data.data)
                }else{
                    this.errorMessage.message('Data tidak ditemukan.')
                }
            });
    }

    getBookingDariAndroid(bookingCode: string) {
        this.http.get<any>(config.api_vclaim('antrian/kodeBookingAndroid/' + bookingCode))
            .subscribe(data => {
                if (data.code == 200) {
                    this.registrasiOnlineAndroid.next(data.data)
                }else{
                    this.errorMessage.message('Data tidak ditemukan.')
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

    saveNomorAntrian(data: any){
        this.http.post<any>( config.api_vclaim('antrian/saveNomorAntrian'), data )
            .subscribe(data => {
                console.log(data);
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
