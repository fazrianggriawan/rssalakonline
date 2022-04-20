import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "../config";
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrasiService {

    getDokter() {
        return this.http.get<any>(config.api_antrol('get/ref_dokter'), {responseType: 'json'});
    }

    getJadwalDokter(data:any){
        return this.http.post<any>(config.api_antrol('get/jadwal_dokter'), data);
    }

    getPesertaBPJS(noKartu:string){
        return this.http.get<any>(config.api_vclaim('peserta/get/kartu_bpjs?noKartu='+noKartu), {responseType: 'json'});
    }

    getDataRujukan(noKartu:string){
        return this.http.get<any>(config.api_vclaim('rujukan/get/list_no_kartu?faskes=1&key='+noKartu), {responseType: 'json'});
    }

    getDataKontrol(){
        return this.http.get<any>(config.api_vclaim('rencana_kontrol/get/data_no_surat_kontrol?filter=2'), {responseType: 'json'});
    }

    getDataKontrolByPeserta(noKartu:string){
        return this.http.get<any>(config.api_vclaim('rencana_kontrol/get/data_no_surat_kontrol_by_peserta?noKartu='+noKartu+'&filter=2'), {responseType: 'json'});
    }

    getHistorySep(noKartu:string){
        return this.http.get<any>(config.api_vclaim('monitoring/get/history_pelayanan?key='+noKartu), {responseType: 'json'});
    }

    getPoli(key:string){
        return this.http.get<any>(config.api_vclaim('ref/get/poli?key='+key), {responseType: 'json'});
    }

    getSep(noSep:string){
        return this.http.get<any>(config.api_vclaim('sep/get/cari_sep?key='+noSep), {responseType: 'json'});
    }

    getRujukan(noRujukan:string){
        return this.http.get<any>(config.api_vclaim('rujukan/get/nomor_rujukan?key='+noRujukan), {responseType: 'json'});
    }

    getSuratKontrol(noSuratKontrol:string){
        return this.http.get<any>(config.api_vclaim('rencana_kontrol/get/?key='+noSuratKontrol), {responseType: 'json'});
    }

    getPoliBpjs(){
        return this.http.get<any>(config.api_online('get/poli_bpjs'), { responseType: 'json' });
    }

    getKodeBooking(kodeBooking:string){
        return this.http.get<any>(config.api_online('get/kode_booking?key='+kodeBooking), { responseType: 'json' });
    }

    getPasien(idPasien:string, searchBy:string){
        return this.http.get<any>(config.api('registrasi/pasien/getDataPasien/?searchBy='+searchBy+'&value='+idPasien), { responseType: 'json' });
    }

    getDokterBpjsById(id:string){
        return this.http.get<any>(config.api('master/dokter/dokterBpjsById/?key='+id), { responseType: 'json' });
    }

    getPoliBpjsById(id:string){
        return this.http.get<any>(config.api('master/poli/getPoliBpjsById/?key='+id), { responseType: 'json' });
    }

    getToday(){
        return this.http.get<any>(config.api('auth/getTodayDate'), { responseType: 'json' });
    }

    getDataPasien(noKartu:string){
        // return this.http.get<any>(config.api_public('vclaim/peserta/get/pasien?noKartu='+noKartu), { responseType: 'json' });
        return this.http.get<any>(config.api('online/get/getPasien?noKartu='+noKartu), { responseType: 'json' });
    }

    saveRegistrasi(data:any){
        return this.http.post<any>(config.api_online('save/registrasi'), data, {responseType: 'json'});
    }

    saveSep(data:any){
        return this.http.post<any>(config.api('vclaim/sep/save/sep'), data, {responseType: 'json'});
    }

    saveSuratKontrol(data:any){
        return this.http.post<any>(config.api('vclaim/rencana_kontrol/save/rencana_kontrol'), data, {responseType: 'json'});
    }

    saveAntrol(data:any){
        return this.http.post<any>(config.api('online/save/registrasi'), data, {responseType: 'json'});
    }

    constructor(
        private http: HttpClient
    ) { }

}
