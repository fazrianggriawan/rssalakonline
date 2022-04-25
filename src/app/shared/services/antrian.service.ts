import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorMessageService } from './error-message.service';

@Injectable({
    providedIn: 'root'
})
export class AntrianService {

    public kodeBooking: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public today: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(
        private http: HttpClient,
        private errorMessageService: ErrorMessageService,
        private anjunganService: AnjunganService
    ) { }

    public getKodeBooking() {
        return this.kodeBooking.asObservable();
    }

    public getToday() {
        return this.today.asObservable();
    }

    public getTodayDate() {
        this.http.get<any>(config.api('auth/getTodayDate'), { responseType: 'json' })
            .subscribe(data => {
                let date = new Date(data).toISOString().split('T')[0];
                this.today.next(date);
            });
    }

    public save(data: any) {
        this.anjunganService.loading.next(true);
        this.http.post<any>(config.api_online('vclaim/antrian/save'), data)
            .subscribe(res => {
                if (res.metadata.code == 200) {
                    this.kodeBooking.next(res.data.kodebooking);
                } else {
                    this.errorMessageService.errorHandle(res.message);
                }
                this.anjunganService.loading.next(false);
            })
    }

}
