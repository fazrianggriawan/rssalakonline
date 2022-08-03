import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';

@Injectable({
    providedIn: 'root'
})
export class MasterService {

    public poliBpjs: BehaviorSubject<any> = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient
    ) { }

    public getPoliBpjs() {
        return this.poliBpjs.asObservable();
    }

    public getAllPoliBpjs() {
        this.http.get<any>(config.api_vclaim('master/poliklinik'))
            .subscribe(res => {
                this.poliBpjs.next(res.data);
            })
    }


}
