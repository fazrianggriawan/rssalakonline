import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { AnjunganService } from '../anjungan.service';
import { VirtualKeyboardService } from '../shared/components/virtual-keyboard/virtual-keyboard.service';

@Component({
    selector: 'app-registrasi-online',
    templateUrl: './registrasi-online.component.html',
    styleUrls: ['./registrasi-online.component.css']
})
export class RegistrasiOnlineComponent implements OnInit {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    kodeBooking: string = '';
    registrasi: any = '';
    pasien: any = '';
    rujukan: any = '';
    jadwalDokter: any = '';
    suratKontrol: any = '';
    peserta: any = '';
    sep: any = '';

    constructor(
        private keyboardService: VirtualKeyboardService,
        public anjunganService: AnjunganService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.keyboardService.getValue().subscribe(data => this.kodeBooking = data)
        this.anjunganService.registrasiOnline.subscribe(data => this.handleDataBooking(data))
        this.anjunganService.peserta.subscribe(data => this.peserta = data);
        this.anjunganService.sep.subscribe(data => {
            if( data ){
                this.sep = data;
                this.printAnjungan(this.sep.noSep, this.registrasi.booking_code);
            }
        })

        this.keyboardService.getEnterAction()
            .subscribe(data => {
                if (data)
                    this.anjunganService.getBookingCode(this.kodeBooking);
            })
        this.onBlur();
    }

    handleDataBooking(data: any) {
        this.reset();
        if (data) {
            this.registrasi = data;
            this.rujukan = JSON.parse(data.rujukan);
            this.jadwalDokter = JSON.parse(data.jadwalDokter);
            this.pasien = JSON.parse(data.pasien);
            this.suratKontrol = JSON.parse(data.suratKontrol);

            this.anjunganService.getPeserta(this.pasien.noaskes);
        }
    }

    reset() {
        this.kodeBooking = '';
        this.registrasi = '';
        this.rujukan = '';
        this.pasien = '';
        this.suratKontrol = '';
        this.sep = '';
        this.onBlur();
    }


    listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.anjunganService.getBookingCode(this.kodeBooking);
        }
    }

    onBlur() {
        setTimeout(() => {
            if (this.searchElement) {
                this.searchElement.nativeElement.focus();
            }
        }, 200);
    }

    createSep() {
        let data = {
            noKartu: this.rujukan.peserta.noKartu,
            tglSep: '2022-07-21',
            jnsPelayanan: '2',
            hakKelas: this.rujukan.peserta.hakKelas,
            naikKelas: '',
            naikKelasPembiayaan: '',
            naikKelasPenanggungJawab: '',
            norm: this.rujukan.peserta.mr.noMR,
            rujukan: { asalFaskes: this.rujukan.asalFaskes.kode, rujukan: this.rujukan },
            catatan: '-',
            diagnosa: this.rujukan.diagnosa,
            poliklinik: { kode: this.jadwalDokter.kodepoli, nama: this.jadwalDokter.namapoli },
            poliklinikEks: '0',
            cob: '0',
            katarak: '0',
            isLakaLantas: '0',
            lakaNoLp: '',
            lakaTglKejadian: '',
            lakaKeterangan: '',
            lakaSuplesi: '',
            lakaNoSuplesi: '',
            lakaPropinsi: '',
            lakaKabupaten: '',
            lakaKecamatan: '',
            tujuanKunj: '',
            flagProcedure: '',
            kdPenunjang: '',
            assessmentPel: '',
            skdp: { noSuratKontrol: '', kodeDokter: '' },
            dokter: { kode: this.jadwalDokter.kodedokter, nama: this.jadwalDokter.namadokter },
            tlp: this.rujukan.peserta.mr.noTelepon
        }

        if (this.registrasi.jns_kunjungan == '3') {
            // Tujuan Kontrol
            data.tujuanKunj = '2'
            data.flagProcedure = ''
            data.assessmentPel = '5'
            data.skdp.noSuratKontrol = this.suratKontrol.noSuratKontrol;
            data.skdp.kodeDokter = this.jadwalDokter.kodedokter;
        } else {
            // Rujukan Baru
            data.tujuanKunj = '0'
            data.flagProcedure = ''
        }

        if (this.jadwalDokter.kodepoli != this.rujukan.poliRujukan.kode) {
            // Rujukan Internal
            data.tujuanKunj = '0'
            data.flagProcedure = ''
            data.assessmentPel = '1'
        }

        this.anjunganService.createSep(data);
    }

    checkIn() {
        this.createSep();
    }

    home() {
        this.reset();
        window.location.replace(config.host + 'registrasi/#/anjungan');
    }


    printAnjungan(noSep:string, bookingCode:string) {
        (<HTMLIFrameElement>document.getElementById('iframePrintSep')).src = config.api_vclaim('sep/print/anjungan/' + noSep + '/' + bookingCode);
        (<HTMLIFrameElement>document.getElementById('iframePrintBooking')).src = config.api_vclaim('sep/print/booking/' + bookingCode);
        this.reset();
    }


}
