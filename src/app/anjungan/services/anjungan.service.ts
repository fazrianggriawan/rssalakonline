import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from 'src/app/config';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AnjunganService {

    registrasiOnline = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService
    ) { }

    getBookingCode(bookingCode: string) {
        this.loadingService.status.next(true);
        this.http.get<any>(config.api_vclaim('antrian/kodeBooking/' + bookingCode))
            .subscribe(data => {
                if( data.code == 200 ){
                    this.registrasiOnline.next(data.data)
                }
                this.loadingService.status.next(false);
            });
    }

    dateHuman(date: string) {
        let tanggal = date.split('-');
        let arrBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        let bulan = parseInt(tanggal[1]) - 1
        return tanggal[2] + ' ' + arrBulan[bulan] + ' ' + tanggal[0];
    }

}
