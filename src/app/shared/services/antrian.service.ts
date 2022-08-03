import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { ErrorMessageService } from './error-message.service';
import { LoadingService } from './loading.service';

@Injectable({
    providedIn: 'root'
})
export class AntrianService {

    public kodeBooking: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public dataBooking: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public dataAntrian: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public dataPoliBpjs: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public today: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public printStatus = new BehaviorSubject<boolean>(false);
    public printStatusBooking = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private errorMessageService: ErrorMessageService,
        private anjunganService: AnjunganService,
        private loadingService: LoadingService
    ) { }

    public getKodeBooking() {
        return this.kodeBooking.asObservable();
    }

    public getDataBooking() {
        return this.dataBooking.asObservable();
    }

    public getDataAntrian() {
        return this.dataAntrian.asObservable();
    }

    public getDataPoliBpjs() {
        return this.dataPoliBpjs.asObservable();
    }

    public getToday() {
        return this.today.asObservable();
    }

    public getPrintStatus() {
        return this.printStatus.asObservable();
    }

    public getPrintStatusBooking() {
        return this.printStatusBooking.asObservable();
    }

    public getTodayDate() {
        this.http.get<any>(config.api('auth/getTodayDate'), { responseType: 'json' })
            .subscribe(data => {
                let date = new Date(data).toISOString().split('T')[0];
                this.today.next(date);
            });
    }

    public save(data: any) {
        this.loadingService.status.next(true);
        this.http.post<any>(config.api('antrian/save'), data)
            .subscribe(res => {
                if (res.code == 200) {
                    this.kodeBooking.next(res.data.kodebooking);
                    this.printStatus.next(true);
                } else {
                    this.errorMessageService.errorHandle(res.message);
                    this.anjunganService.openPanel.next(false);
                }
                this.loadingService.status.next(false);
            })
    }

    public filterAntrian(data: any) {
        this.loadingService.status.next(true);
        this.http.post<any>(config.api_vclaim('antrian/filterData'), data)
            .subscribe(res => {
                this.dataAntrian.next(res.data);
                this.loadingService.status.next(false);
            })
    }

    public getMasterPoliBpjs() {
        this.http.get<any>(config.api('antrian/'))
    }

    public cariBooking(kodeBooking: string) {
        this.loadingService.status.next(true);
        this.http.get<any>(config.api('antrian/booking/kodeBooking/' + kodeBooking))
            .subscribe(res => {
                if (res.code == 200) {
                    this.kodeBooking.next(res.data.noreg);
                    this.printStatusBooking.next(true);
                } else {
                    this.errorMessageService.errorHandle(res.message);
                }
                this.loadingService.status.next(false);
            })
    }

    public terbilang(x:any, sen:boolean=false) {
        let res : any;
        let abil: any = [];

        if( sen == false ){
            abil = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
          }else{
            abil = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
          }

        if (x < 12) {
            res = " " + abil[x];
        } else if (x < 20) {
            res = this.terbilang(x - 10) + " belas";
        } else if (x < 100) {
            res = this.terbilang(Math.floor(x/10)) + " puluh" + this.terbilang(x % 10);
        } else if (x < 200) {
            res = " seratus" + this.terbilang(x - 100);
        } else if (x < 1000) {
            res = this.terbilang(x / 100) + " ratus" + this.terbilang(x % 100);
        } else if (x < 2000) {
            res = " seribu" + this.terbilang(x - 1000);
        } else if (x < 1000000){
            res = this.terbilang(x / 1000) + " ribu" + this.terbilang(x % 1000);
        } else if (x < 1000000000) {
            res = this.terbilang(x / 1000000) + " juta" + this.terbilang(x % 1000000);
        } else if (x < 1000000000000){
            res = this.terbilang(x / 1000000000) + " milyar" + this.terbilang(x % 1000000000);
        }

        return res;
    }

}
