import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "../config";
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrasiService {

    getDokter() {
        return this.http.get<any>(config.api_antrol('get/ref_dokter'));
    }

    getJadwalDokter(data:any){
        return this.http.post<any>(config.api_antrol('get/jadwal_dokter'), data);
    }

    getPesertaBPJS(noKartu:string){
        return this.http.get<any>(config.api_vclaim('peserta/get/kartu_bpjs?noKartu='+noKartu));
    }

    getDataRujukan(noKartu:string){
        return this.http.get<any>(config.api_vclaim('rujukan/get/list_no_kartu?faskes=1&key='+noKartu));
    }

    getDataKontrol(){
        return this.http.get<any>(config.api_vclaim('rencana_kontrol/get/data_no_surat_kontrol?filter=2'));
    }

    saveRegistrasi(data:any){
        return this.http.post<any>(config.api_online('save/registrasi'), data);
    }

    constructor(
        private http: HttpClient
    ) { }

}
