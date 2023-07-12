import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfirmationService } from 'primeng/api';
import { tap } from 'rxjs';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css'],
    providers: [ConfirmationService]
})
export class SuccessComponent implements OnInit {

    @ViewChild('screen', { static: true }) screen: any;

    booking: any;
    imageCapture: any;
    sesi: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private captureService: NgxCaptureService,
        private confirmationService: ConfirmationService,
        private appService: AppService,
        private router: Router
    ) { }

    ngOnInit(): void {
        let booking: any = sessionStorage.getItem('booking');
        let sesi: any = sessionStorage.getItem('sesi');
        this.booking = JSON.parse(booking);
        this.sesi = JSON.parse(sesi);
        this.captureImage();
        this.clearData();
    }

    clearData() {
        this.registrasiOnlineService.dataBooking.next('');
        this.registrasiOnlineService.createSuratKontrolStatus.next(false);
        this.registrasiOnlineService.saveStatus.next(false);
        sessionStorage.removeItem('jadwalDokter');
        sessionStorage.removeItem('jenisPembayaran');
        sessionStorage.removeItem('peserta');
        sessionStorage.removeItem('rujukan');
        sessionStorage.removeItem('suratKontrol');
        sessionStorage.removeItem('pasien');
    }

    captureImage() {
        setTimeout(() => {
            this.captureService.getImage(this.screen.nativeElement, true)
                .pipe(
                    tap(img => {
                        this.imageCapture = img;
                    })
                ).subscribe();
        }, 100);
    }

    batalkanKunjungan() {
        this.confirmationService.confirm({
            header: 'Konfirmasi',
            message: 'Anda yakin ingin membatalkan kunjungan ini?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                let data = { kode_booking: this.booking.kodebooking };
                this.registrasiOnlineService.batalkanKunjungan(data)
                    .subscribe(data => {
                        if (data) {
                            let suratKontrol = this.appService.jsonParse(data.suratKontrol);
                            if( suratKontrol.noSuratKontrol ){
                                this.registrasiOnlineService.deleteSuratKontrol(suratKontrol.noSuratKontrol)
                            }
                            this.router.navigateByUrl('');
                        }
                    })
            }
        });
    }

}
