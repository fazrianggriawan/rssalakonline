import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorMessageService } from './error-message.service';

@Injectable({
    providedIn: 'root'
})
export class PesertaService {

    public peserta : BehaviorSubject<any> = new BehaviorSubject<any>('');
    public pasien : BehaviorSubject<any> = new BehaviorSubject<any>('');
    public confirmed : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private errorMessageService: ErrorMessageService,
        private anjunganService: AnjunganService
    ) { }

    public getPeserta()
    {
        return this.peserta.asObservable();
    }

    public getPasien()
    {
        return this.pasien.asObservable();
    }

    public getConfirmed()
    {
        return this.confirmed.asObservable();
    }

    public cariPeserta(nomorKartu:string)
    {
        this.anjunganService.loading.next(true);
        this.http.get<any>( config.api('vclaim/peserta/nomorKartu/'+nomorKartu), {responseType: 'json'} )
            .subscribe(res => {
                if( res.metaData.code == 200 ) {
                    this.peserta.next(res.response.peserta);
                }else{
                    this.errorMessageService.errorHandle( res.metaData.message );
                }
                this.anjunganService.loading.next(false);
            });
    }

    public cariPasien(nomorKartu:string)
    {
        this.anjunganService.loading.next(true);
        this.http.get<any>(config.api('online/get/getPasien?noKartu='+nomorKartu), { responseType: 'json' })
            .subscribe(res => {
                if (res.code == 200) {
                    this.pasien.next( res.data );
                }else{
                    this.errorMessageService.errorHandle( res.message );
                }
                this.anjunganService.loading.next(false);
            });
    }
}
