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
        let dataAntrian : any = {
            pasien: this.pasien,
            peserta: this.peserta,
            rujukan: this.rujukan,
            suratKontrol: this.suratKontrol,
            jadwalDokter: this.jadwalDokter,
            jenisPembayaran: 'bpjs',
            jenisKunjungan: this.jenisKunjungan,
            tanggal: this.appService.reformatDate(new Date()),
            ars: null
        }

        let registrasi = {
            nomorkartu: this.peserta.noKartu, //0001798426113
            nik: this.peserta.nik, //1671021503960006
            nohp: this.peserta.mr.noTelepon, //087744558524
            cara_bayar: 'BPJS', //BPJS
            status_pendaftaran: 'LAMA', //LAMA
            jenispasien: 'JKN', //NON JKN
            kodepoli: this.jadwalDokter.kodesubspesialis, //THT
            norm: this.pasien.norekmed, //0213254
            tanggalperiksa: this.appService.reformatDate(new Date()), //2023-07-11
            kodedokter: this.jadwalDokter.kodedokter.toString(), //219194
            namadokter: this.jadwalDokter.namadokter, //dr.ROPI AFFANDI, Sp.THT-KL
            jampraktek: this.jadwalDokter.jadwal, //08:00-10:00
            jeniskunjungan: '1', //1
            nomorreferensi: this.rujukan.noKunjungan, //02132541689048022689
        }

        this.registrasiOnlineService.saveRegistrasi(registrasi)
            .subscribe(data => {
                if( data.metadata.code == 200 ){
                    dataAntrian.ars = data.response;
                    this.registrasiOnlineService.saveBooking(dataAntrian)
                        .subscribe(data => {
                            if( data ){
                                this.dataBooking = data;
                                sessionStorage.setItem('data_booking', JSON.stringify(this.dataBooking));
                                this.createSep();
                            }

                        })
                }else{
                    this.errorMessageService.message(data.metadata.message);
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
                this.sep = data;
                this.printAnjungan();
                this.success = true;
            })
    }

    done(){
        this.router.navigateByUrl('anjungan');
    }

    printBarcode(){
        if( this.dataBooking.booking_code && this.sep.noSep ){
            this.appService.print(config.api_vclaim('sep/print/booking/' + this.dataBooking.booking_code));
        }
    }

    printAnjungan() {
        if( this.dataBooking.booking_code && this.sep.noSep ){
            this.appService.print(config.api_vclaim('sep/print/anjungan/' + this.sep.noSep + '/' + this.dataBooking.booking_code))
        }
    }

}
