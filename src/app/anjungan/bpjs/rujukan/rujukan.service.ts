import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { config } from 'src/app/config';

@Injectable({providedIn: 'root'})

export class RujukanService {

    constructor(private httpClient: HttpClient) { }

    getRujukanFaskes(nomorKartu: string): Observable<any>{
        let subject = new Subject;

        this.httpClient.get<any>(config.api_vclaim('rujukan/faskes/nomorKartu/' + nomorKartu))
            .subscribe(data => {
                let dataRujukan: any = [];
                if (data.metaData.code == '200') {
                    data.response.rujukan.forEach((element: any) => {
                        element.asalFaskes = {
                            kode: data.response.asalFaskes,
                            nama: 'fktp',
                            jenisKunjungan: 1
                        }
                        dataRujukan.push(element);
                    });
                }
                subject.next(dataRujukan);
            })

        return subject
    }

    getRujukanRS(nomorKartu: string): Observable<any>{
        let subject = new Subject;

        this.httpClient.get<any>(config.api_vclaim('rujukan/rs/nomorKartu/' + nomorKartu))
            .subscribe(data => {
                let dataRujukan: any = [];
                if (data.metaData.code == '200') {
                    data.response.rujukan.forEach((element: any) => {
                        element.asalFaskes = {
                            kode: data.response.asalFaskes,
                            nama: 'fktp',
                            jenisKunjungan: 1
                        }
                        dataRujukan.push(element);
                    });
                }
                subject.next(dataRujukan);
            })

        return subject
    }

}