import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorMessageService } from './error-message.service';

@Injectable({
    providedIn: 'root'
})
export class RujukanService {

    public dataRujukanFaskes : BehaviorSubject<any> = new BehaviorSubject<any>('');
    public dataRujukanRs : BehaviorSubject<any> = new BehaviorSubject<any>('');
    public rujukan : BehaviorSubject<any> = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient,
        private anjunganService: AnjunganService,
        private errorMessageService: ErrorMessageService
    ) { }

    public getDataRujukanFaskes()
    {
        return this.dataRujukanFaskes.asObservable();
    }

    public getDataRujukanRs()
    {
        return this.dataRujukanRs.asObservable();
    }

    public getRujukan()
    {
        return this.rujukan.asObservable();
    }

    public cariDataRujukanFaskes(nomorKartu:string)
    {
        this.anjunganService.loading.next(true);
        this.http.get<any>(config.api_online('vclaim/rujukan/faskes/nomorKartu/'+nomorKartu))
            .subscribe( res => {
                if( res.metaData.code == 200 ){
                    this.dataRujukanFaskes.next(res.response);
                }else{
                    this.errorMessageService.errorHandle(res.metaData.message);
                }
                this.anjunganService.loading.next(false);
            } )
    }

    public cariDataRujukanRs(nomorKartu:string)
    {
        this.anjunganService.loading.next(true);
        this.http.get<any>(config.api_online('vclaim/rujukan/rs/nomorKartu/'+nomorKartu))
            .subscribe( res => {
                if( res.metaData.code == 200 ){
                    this.dataRujukanRs.next(res.response);
                }
                this.anjunganService.loading.next(false);
            } )
    }

}
