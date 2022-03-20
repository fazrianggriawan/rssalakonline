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
        return this.http.post<any>(config.api_antrol('get/jadwal_dokter'), data, {responseType: 'json'});
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

    saveRegistrasi(data:any){
        return this.http.post<any>(config.api_online('save/registrasi'), data, {responseType: 'json'});
    }

    constructor(
        private http: HttpClient
    ) { }

}
