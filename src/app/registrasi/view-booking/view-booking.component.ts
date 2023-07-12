import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-view-booking',
    templateUrl: './view-booking.component.html',
    styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private registrasiOnlineService: RegistrasiOnlineService,
        private appService: AppService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            let kode_booking = params.get('kode_booking');
            if( kode_booking ){
                this.dataBooking(kode_booking);
            }
        })
    }

    dataBooking(kode_booking: string) {
        this.registrasiOnlineService.getDataBooking(kode_booking)
            .subscribe((data: any) => {
                if( data ){
                    let jadwalDokter = this.appService.jsonParse(data.antrian_detail.jadwalDokter);
                    let rujukan = this.appService.jsonParse(data.antrian_detail.rujukan);
                    let booking : any = {
                        nomorantrean: data.prefix_antrian+'-'+data.no_antrian,
                        kodebooking: data.booking_code,
                        nama: data.nama,
                        tanggalperiksa: jadwalDokter.tglKunjungan,
                        namapoli: jadwalDokter.namapoli,
                        namadokter: jadwalDokter.namadokter,
                        jampraktek: jadwalDokter.jadwal,
                        norekmed: data.norm,
                        nomorkartu: data.no_kartu_bpjs,
                        noRujukan: rujukan.noKunjungan,
                    }
                    sessionStorage.setItem('booking', JSON.stringify(booking));
                    sessionStorage.setItem('sesi', data.antrian_detail.sesi);

                    this.router.navigateByUrl('registrasi/success');
                }
            })
    }

}
