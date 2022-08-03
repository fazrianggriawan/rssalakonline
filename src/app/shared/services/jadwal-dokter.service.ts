import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorMessageService } from './error-message.service';

@Injectable({
    providedIn: 'root'
})
export class JadwalDokterService {

    public dataJadwalDokter : BehaviorSubject<any> = new BehaviorSubject<string>('');
    public jadwalDokter : BehaviorSubject<any> = new BehaviorSubject<string>('');

    constructor(
        private http: HttpClient,
        private errorMessage: ErrorMessageService,
        private anjunganService: AnjunganService
    ) { }

    public getDataJadwalDokter()
    {
        return this.dataJadwalDokter.asObservable();
    }

    public getJadwalDokter()
    {
        return this.jadwalDokter.asObservable();
    }

    public cariJadwalDokter(poliklinik:string)
    {
        this.anjunganService.loading.next(true);
        let data = { poli: poliklinik };
        this.http.get<any>( config.api_vclaim('referensi/jadwalDokter/poli/'+poliklinik+'/tanggal/now'))
            .subscribe(res => {
                if( res.metadata.code == 200 ) {
                    this.dataJadwalDokter.next(res.response);
                }else{
                    this.errorMessage.errorHandle( res.metadata.message );
                }
                this.anjunganService.loading.next(false);
            });
    }
}
