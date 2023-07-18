import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { AppService } from 'src/app/services/app.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';

@Component({
    selector: 'app-konfirmasi',
    templateUrl: './konfirmasi.component.html',
    styleUrls: ['./konfirmasi.component.css']
})
export class KonfirmasiComponent implements OnInit {

    pasien: any;
    peserta: any;
    rujukan: any;
    jadwalDokter: any;
    jenisKunjungan: any;
    lastSep: any;
    suratKontrol: any;
    sep: any;
    dataBooking: any;
    success: boolean  = false;

    subSep : any;
    subHistorySep : any;

    constructor(
        private router: Router,
        public registrasiOnlineService: RegistrasiOnlineService,
        private errorMessageService: ErrorMessageService,
        private appService: AppService,
    ) { }

    ngOnInit(): void {
        this.getSessionData();
    }

    getSessionData() {
        let pasien: any = sessionStorage.getItem('pasien');
        let peserta: any = sessionStorage.getItem('peserta');
        let rujukan: any = sessionStorage.getItem('rujukan');
        let surat_kontrol: any = sessionStorage.getItem('surat_kontrol');
        let jadwalDokter: any = sessionStorage.getItem('jadwal_dokter');
        let jnsKunjungan: any = sessionStorage.getItem('jns_kunjungan');

        this.pasien = JSON.parse(pasien);
        this.peserta = JSON.parse(peserta);
        this.rujukan = JSON.parse(rujukan);
        this.suratKontrol = JSON.parse(surat_kontrol);
        this.jadwalDokter = JSON.parse(jadwalDokter);
        this.jenisKunjungan = JSON.parse(jnsKunjungan);

    }

    back() {
        sessionStorage.removeItem('jadwalDokter');
        this.router.navigateByUrl('anjungan/bpjs/jadwalDokter');
    }

    daftar() {
        let data = {
            pasien: this.pasien,
            peserta: this.peserta,
            rujukan: this.rujukan,
            suratKontrol: this.suratKontrol,
            jadwalDokter: this.jadwalDokter,
            jenisPembayaran: 'bpjs',
            jenisKunjungan: this.jenisKunjungan,
            tanggal: this.appService.reformatDate(new Date())
        }

        this.registrasiOnlineService.saveBooking(data)
            .subscribe(data => {
                if( data ){
                    this.dataBooking = data;
                    sessionStorage.setItem('data_booking', this.dataBooking);
                    this.createSep();
                }

            })
    }

    createSep() {
        let data = {
            peserta: this.peserta,
            tanggal: this.registrasiOnlineService.reformatDate(new Date()),
            jnsPelayanan: '2', // Rawat Jalan
            pasien: this.pasien,
            rujukan: this.rujukan,
            diagnosa: this.rujukan.diagnosa,
            jadwalDokter: this.jadwalDokter,
            tujuanKunj: this.jenisKunjungan.tujuanKunj,
            assessmentPel: this.jenisKunjungan.assessmentPel,
            suratKontrol: this.suratKontrol
        }

        this.registrasiOnlineService.createSep(data)
            .subscribe(data => {
                if( data ){
                    console.log(this.sep);
                    // this.sep = data;
                    // this.printAnjungan();
                }
            })
    }

    done(){
        this.router.navigateByUrl('anjungan');
    }

    printAnjungan() {
        if( this.dataBooking.kodebooking && this.sep.noSep ){
            (<HTMLIFrameElement>document.getElementById('iframePrintSepBpjs')).src = config.api_vclaim('sep/print/anjungan/' + this.sep.noSep + '/' + this.dataBooking.kodebooking);
            // (<HTMLIFrameElement>document.getElementById('iframePrintBookingBpjs')).src = config.api_vclaim('sep/print/booking/' + this.dataBooking.kodebooking);
        }
    }

}
