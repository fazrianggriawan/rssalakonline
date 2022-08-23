import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

    @ViewChild('screen', { static: true }) screen: any;

    booking: any;
    imageCapture: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private captureService: NgxCaptureService
    ) { }

    ngOnInit(): void {
        let booking : any = sessionStorage.getItem('booking');
        this.booking = JSON.parse(booking);
        this.captureImage();
        this.clearData();
    }

    clearData(){
        this.registrasiOnlineService.dataBooking.next('');
        this.registrasiOnlineService.createSuratKontrolStatus.next(false);
        this.registrasiOnlineService.saveStatus.next(false);
        sessionStorage.removeItem('jadwalDokter');
        sessionStorage.removeItem('jenisPembayaran');
        sessionStorage.removeItem('peserta');
        sessionStorage.removeItem('rujukan');
        sessionStorage.removeItem('suratKontrol');
    }

    captureImage(){
        setTimeout(() => {
            this.captureService.getImage(this.screen.nativeElement, true)
            .pipe(
                tap(img => {
                    this.imageCapture = img;
                })
            ).subscribe();
        }, 100);

    }

}
