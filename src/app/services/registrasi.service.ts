import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "../config";
import { BehaviorSubject, catchError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RegistrasiService {

    isRegistered = new BehaviorSubject<any>(false);
    jadwalDokter = new BehaviorSubject<any>(false);
    pasien = new BehaviorSubject<any>('');

    checkIsRegistered(nomorKartu: string) {
        return this.http.get<any>(config.api('antrian/isRegistered/nomorKartu/' + nomorKartu))
    }

    getJadwalDokter(data: any) {
        return this.http.post<any>(config.api('antrol/jadwal_dokter'), data);
    }

    getJadwalDokter2(data: any) {
        this.jadwalDokter.next([]);
        this.http.post<any>(config.api('antrol/jadwal_dokter'), data).subscribe(res => {
            if (res.metadata.code == 200 && res.response) {
                this.jadwalDokter.next(res.response);
            }
        });
    }

    getPasienSimrs(norm: string) {
        this.http.get<any>( config.api('vclaim/peserta/get/pasienByNorm/'+norm.padStart(10, '0')) ).subscribe(data => {
            if( data.code == 200 ){
                this.pasien.next(data)
            }else{
                alert('Pasien Tidak Ditemukan.');
            }
        })
    }

    getDokter() {
        return this.http.get<any>(config.api('antrol/get/ref_dokter'), { responseType: 'json' });
    }

    getPesertaBPJS(noKartu: string) {
        return this.http.get<any>(config.api('vclaim/peserta/nomorKartu/' + noKartu), { responseType: 'json' });
    }

    getHistorySep(noKartu: string) {
        return this.http.get<any>(config.api('vclaim/historySep/nomorKartu/' + noKartu), { responseType: 'json' });
    }

    getSep(noSep: string) {
        return this.http.get<any>(config.api('vclaim/sep/nomorSep/' + noSep), { responseType: 'json' });
    }

    getRujukan(noRujukan: string) {
        return this.http.get<any>(config.api('vclaim/rujukan/nomorRujukan/' + noRujukan), { responseType: 'json' });
    }

    getDataKontrolByPeserta(noKartu: string) {
        return this.http.get<any>(config.api('vclaim/suratKontrol/byPeserta/nomorKartu/' + noKartu + '/filter/2'), { responseType: 'json' });
    }

    getPoli(key: string) {
        return this.http.get<any>(config.api('vclaim/referensi/poliklinik/' + key), { responseType: 'json' });
    }

    getDataRujukan(noKartu: string) {
        return this.http.get<any>(config.api('vclaim/rujukan/get/list_no_kartu?faskes=1&key=' + noKartu), { responseType: 'json' });
    }

    getDataKontrol() {
        return this.http.get<any>(config.api('vclaim/rencana_kontrol/get/data_no_surat_kontrol?filter=2'), { responseType: 'json' });
    }

    getSuratKontrol(noSuratKontrol: string) {
        return this.http.get<any>(config.api('vclaim/rencana_kontrol/get/?key=' + noSuratKontrol), { responseType: 'json' });
    }

    getPoliBpjs() {
        return this.http.get<any>(config.api('online/get/poli_bpjs'), { responseType: 'json' });
    }

    getKodeBooking(kodeBooking: string) {
        return this.http.get<any>(config.api('online/get/kode_booking?key=' + kodeBooking), { responseType: 'json' });
    }

    getPasien(idPasien: string, searchBy: string) {
        return this.http.get<any>(config.api('registrasi/pasien/getDataPasien/?searchBy=' + searchBy + '&value=' + idPasien), { responseType: 'json' });
    }

    getDokterBpjsById(id: string) {
        return this.http.get<any>(config.api('master/dokter/dokterBpjsById/?key=' + id), { responseType: 'json' });
    }

    getPoliBpjsById(id: string) {
        return this.http.get<any>(config.api('master/poli/getPoliBpjsById/?key=' + id), { responseType: 'json' });
    }

    getToday() {
        return this.http.get<any>(config.api('auth/getTodayDate'), { responseType: 'json' });
    }

    getDataPasien(noKartu: string) {
        // return this.http.get<any>(config.api_public('vclaim/peserta/get/pasien?noKartu='+noKartu), { responseType: 'json' });
        return this.http.get<any>(config.api('online/get/getPasien?noKartu=' + noKartu), { responseType: 'json' });
    }

    saveRegistrasi(data: any) {
        return this.http.post<any>(config.api('online/save/registrasi'), data, { responseType: 'json' });
    }

    saveSep(data: any) {
        return this.http.post<any>(config.api('vclaim/sep/save/sep'), data, { responseType: 'json' });
    }

    saveSuratKontrol(data: any) {
        return this.http.post<any>(config.api('vclaim/rencana_kontrol/save/rencana_kontrol'), data, { responseType: 'json' });
    }

    saveAntrol(data: any) {
        return this.http.post<any>(config.api('antrian/save'), data, { responseType: 'json' });
    }

    constructor(
        private http: HttpClient
    ) { }

}
