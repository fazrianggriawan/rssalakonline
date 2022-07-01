import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorMessageService } from './error-message.service';

@Injectable({
    providedIn: 'root'
})
export class SepService {

    public historySep : BehaviorSubject<any> = new BehaviorSubject<any>('');
    public sep : BehaviorSubject<any> = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient,
        private errorMessage: ErrorMessageService,
        private anjunganService: AnjunganService
    ) { }

    public getHistorySep()
    {
        return this.historySep.asObservable();
    }

    public getSep()
    {
        return this.sep.asObservable();
    }

    public getDataHistorySep(nomorKartu:string)
    {
        this.anjunganService.loading.next(true);
        this.http.get<any>( config.api('vclaim/sep/history/nomorKartu/'+nomorKartu), {responseType: 'json'} )
            .subscribe(res => {
                if( res.metaData.code == 200 ) {
                    this.historySep.next(res.response.histori);
                }else{
                    this.errorMessage.errorHandle( res.metaData.message );
                }
                this.anjunganService.loading.next(false);
            });
    }
}
