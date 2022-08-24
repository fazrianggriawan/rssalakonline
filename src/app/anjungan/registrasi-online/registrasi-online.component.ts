import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
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

    subSep : any;
    subRegistrasi : any;
    subPeserta : any;

    constructor(
        private keyboardService: VirtualKeyboardService,
        public anjunganService: AnjunganService,
        private router: Router,
        private registrasiOnlineService: RegistrasiOnlineService
    ) { }

    ngOnInit(): void {
        this.reset();
        this.keyboardService.getValue().subscribe(data => this.kodeBooking = data)
        this.subRegistrasi = this.anjunganService.registrasiOnline.subscribe(data => this.handleDataBooking(data))
        this.subPeserta = this.anjunganService.peserta.subscribe(data => this.peserta = data);
        this.subSep = this.anjunganService.sep.subscribe(data => {
            this.sep = data;
            if( data ){
                this.printAnjungan(this.sep.noSep, this.registrasi.booking_code);
                this.registrasiOnlineService.checkin(this.registrasi);
            }
        })

        this.keyboardService.getEnterAction()
            .subscribe(data => {
                if (data)
                    this.getDataBooking(this.kodeBooking);
            })
        this.onBlur();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subPeserta.unsubscribe();
        this.subRegistrasi.unsubscribe();
        this.subSep.unsubscribe();
    }

    handleDataBooking(data: any) {
        this.registrasi = data;
        if (data) {
            this.rujukan = JSON.parse(data.rujukan);
            this.jadwalDokter = JSON.parse(data.jadwalDokter);
            this.pasien = JSON.parse(data.pasien);
            this.suratKontrol = JSON.parse(data.suratKontrol);
            this.anjunganService.getPeserta(this.pasien.noaskes);
        }
    }

    reset() {
        this.kodeBooking = '';
        this.rujukan = '';
        this.pasien = '';
        this.suratKontrol = '';
        this.anjunganService.sep.next('');
        this.anjunganService.peserta.next('');
        this.anjunganService.registrasiOnline.next('')

        this.onBlur();
    }

    getDataBooking(kodeBooking: string){
        this.reset();
        this.anjunganService.getBookingCode(kodeBooking);
    }


    listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.getDataBooking(this.kodeBooking);
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

    printAnjungan(noSep:string, bookingCode:string) {
        if( noSep && bookingCode ){
            (<HTMLIFrameElement>document.getElementById('iframePrintSep')).src = config.api_vclaim('sep/print/anjungan/' + noSep + '/' + bookingCode);
            (<HTMLIFrameElement>document.getElementById('iframePrintBooking')).src = config.api_vclaim('sep/print/booking/' + bookingCode);
            this.reset();
        }
    }

    back() {
        this.reset();
        this.router.navigateByUrl('/anjungan');
    }


}
