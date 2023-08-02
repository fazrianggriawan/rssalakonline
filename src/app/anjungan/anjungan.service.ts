import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
                } else {
                    this.errorMessage.message('Data tidak ditemukan.')
                }
            });
    }

    getBookingDariAndroid(bookingCode: string) {
        this.http.get<any>(config.api_vclaim('antrian/kodeBookingAndroid/' + bookingCode))
            .subscribe(data => {
                if (data.code == 200) {
                    this.registrasiOnlineAndroid.next(data.data)
                } else {
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

    saveNomorAntrian(data: any) {
        this.http.post<any>(config.api_vclaim('antrian/saveNomorAntrian'), data)
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
                } else {
                    alert(data.metaData.message + ' Hubungi loket pendaftaran untuk mendapatkan bantuan.');
                }
            })
    }

    dateHuman(date: string) {
        let tanggal = date.split('-');
        let arrBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        let bulan = parseInt(tanggal[1]) - 1
        return tanggal[2] + ' ' + arrBulan[bulan] + ' ' + tanggal[0];
    }

    validasiSesiKunjungan(kodeBooking: any): Observable<any> {
        let subject = new Subject;
        this.http.get<any>(config.api('online/validasi_sesi_kunjungan/' + kodeBooking))
            .subscribe(data => {
                if (data.code == 200) {
                    subject.next(true)
                } else {
                    subject.next(false)
                    this.errorMessage.message(data.message)
                }
            })
        return subject;
    }

    getSuratKontrol(noSuratKontrol: any): Observable<any> {
        let subject = new Subject;
        this.http.get<any>(config.api_vclaim('suratKontrol/get/' + noSuratKontrol))
            .subscribe(data => {
                if (data.metaData.code == 200) {
                    subject.next(true)
                } else {
                    subject.next(false)
                    this.errorMessage.message(data.metaData.message)
                }
            })
        return subject;
    }

    sendToFingerPrint(nomor_kartu_bpjs: any): Observable<any> {
        let subject = new Subject;
        this.http.post<any>(config.api_vclaim('anjungan/send-to-fingerprint'), { nomor_kartu: nomor_kartu_bpjs })
            .subscribe(data => {
                if (data.code == 200) {
                    subject.next(true)
                } else {
                    subject.next(false)
                    this.errorMessage.message(data.message)
                }
            })
        return subject;
    }

    getFingerPrint(no_kartu_bpjs: any, tanggal: string) {
        let subject = new Subject;
        this.http.get<any>(config.api_vclaim('sep/fingerprint/'+no_kartu_bpjs+'/'+tanggal))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    if( data.response.kode == "1" ){
                        subject.next(true)
                    }else{
                        subject.next(false)
                    }
                } else {
                    subject.next(false)
                }
            })
        return subject;
    }

    simpanApprovalSep(data: any): Observable<any> {
        let subject = new Subject;
        this.http.post<any>(config.api_vclaim('sep/pengajuan-approval'), data)
            .subscribe(data => {
                subject.next(data);
            })
        return subject;
    }

}
