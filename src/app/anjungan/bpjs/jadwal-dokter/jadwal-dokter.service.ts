import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { config } from 'src/app/config';

@Injectable({providedIn: 'root'})

export class JadwalDokterService {

    constructor(private httpClient: HttpClient) { }

    getDefaultPelaksana(jadwalDokter: any): Observable<any>{
        let subject = new Subject;

        this.httpClient.post<any>(config.api_url('online/default-pelaksana'), jadwalDokter)
            .subscribe(data => {
                subject.next(data.data)
            })

        return subject
    }

}