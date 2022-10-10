import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class RegistrasiOnlineComponent implements OnInit, OnDestroy {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    kodeBooking: string = '';
    registrasi: any = '';
    pasien: any = '';
    rujukan: any = '';
    jadwalDokter: any = '';
    suratKontrol: any = '';
    peserta: any = '';
    sep: any = '';
    registrasiAndroid: any = '';

    subSep : any;
    subRegistrasi : any;
    subPeserta : any;
    subEnter : any;
    subRegistrasiAndroid: any;
    subDataPasien: any;

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
        this.registrasiOnlineService.dataHistorySep.subscribe(data => this.handleHistorySep(data))
        this.subRegistrasiAndroid = this.registrasiOnlineService.registrasiAndroid.subscribe(data => this.handleRegistrasiAndroid(data))
        this.subDataPasien = this.registrasiOnlineService.dataPasien.subscribe(data => this.handlePasien(data))

        this.subSep = this.anjunganService.sep.subscribe(data => {
            this.sep = data;
            if( data ){
                this.printAnjungan();
                this.registrasiOnlineService.checkin(this.registrasi);
            }
        })

        this.subEnter = this.keyboardService.enterAction
            .subscribe(data => {
                if (data){
                    this.getDataBooking(this.kodeBooking)
                }
            })
        this.onBlur();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subPeserta.unsubscribe();
        this.subRegistrasi.unsubscribe();
        this.subSep.unsubscribe();
        this.subEnter.unsubscribe();
        this.subDataPasien.unsubscribe();
        this.subRegistrasiAndroid.unsubscribe();
        this.keyboardService.clearAction()
    }

    handleHistorySep(data: any) {
        this.sep = '';
        if (data) {
            let today = this.registrasiOnlineService.reformatDate(new Date());
            data.forEach((item: any) => {
                if( item.tglSep == today ){
                    this.sep = item;
                }
            });
        }
    }

    handlePasien(data: any){
        if(data.noaskes){
            this.registrasiOnlineService.getHistorySep(data.noaskes)
        }
    }

    handleDataBooking(data: any) {
        this.registrasi = data;
        if (data) {
            this.rujukan = JSON.parse(data.rujukan);
            this.jadwalDokter = JSON.parse(data.jadwalDokter);
            this.pasien = JSON.parse(data.pasien);
            this.suratKontrol = JSON.parse(data.suratKontrol);
            this.anjunganService.getPeserta(this.pasien.noaskes);
            this.registrasiOnlineService.getHistorySep(this.pasien.noaskes);
        }
    }

    handleRegistrasiAndroid(data: any){
        if( data ){
            this.registrasiAndroid = data;
            this.pasien = { alamat: data.alamat }
            this.registrasi = { nama: data.nama, booking_code: data.noreg, noAntrian: data.antrian }
            this.registrasiOnlineService.getPasienByRm(data.norekmed);
        }

    }

    reset() {
        this.kodeBooking = '';
        this.rujukan = '';
        this.pasien = '';
        this.suratKontrol = '';
        this.jadwalDokter = '';
        this.registrasiAndroid = '';
        this.anjunganService.sep.next('');
        this.anjunganService.peserta.next('');
        this.anjunganService.registrasiOnline.next('')
        this.registrasiOnlineService.registrasiAndroid.next('')
        this.registrasiOnlineService.dataPasien.next('');
        this.keyboardService.enterAction.next(false);

        this.onBlur();
    }

    getDataBooking(kodeBooking: string){
        this.reset();
        let isnum = /^\d+$/.test(kodeBooking.trim());
        if(isnum){
            this.registrasiOnlineService.getDataBookingAndroid(kodeBooking);
        }else{
            this.anjunganService.getBookingCode(kodeBooking);
        }
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

        if( this.registrasi.jns_kunjungan == '1' ){
            // Rujukan Baru
            data.tujuanKunj = '0'
            data.flagProcedure = ''
        }

        if( this.registrasi.jns_kunjungan == '2' ){
            // Rujukan Internal
            data.tujuanKunj = '0'
            data.flagProcedure = ''
            data.assessmentPel = '1'
        }

        if (this.registrasi.jns_kunjungan == '3') {
            // Tujuan Kontrol
            data.tujuanKunj = '2'
            data.flagProcedure = ''
            data.assessmentPel = '5'
            data.skdp.noSuratKontrol = this.suratKontrol.noSuratKontrol;
            data.skdp.kodeDokter = this.jadwalDokter.kodedokter;
        }

        this.anjunganService.createSep(data);
    }

    checkIn() {
        if( this.registrasiAndroid ){
            this.printAntrianRegistrasiAndroid(this.registrasiAndroid.antrian);
        }else{
            if( this.sep ){
                this.registrasiOnlineService.sep.next(this.sep);
            }else{
                this.createSep();
            }
        }
    }

    printAnjungan() {
        if( this.sep.noSep && this.registrasi.booking_code ){
            (<HTMLIFrameElement>document.getElementById('iframePrintSep')).src = config.api_vclaim('sep/print/anjungan/' + this.sep.noSep + '/' + this.registrasi.booking_code);
            (<HTMLIFrameElement>document.getElementById('iframePrintBooking')).src = config.api_vclaim('sep/print/booking/' + this.registrasi.booking_code);
            this.reset();
        }
    }

    back() {
        this.reset();
        this.router.navigateByUrl('/anjungan');
    }

    printSep(noSep: string){
        (<HTMLIFrameElement>document.getElementById('iframePrintSep')).src = config.api_vclaim('sep/print/anjunganSepOnly/' + noSep );
        if( this.registrasiAndroid ){
            this.printAntrianRegistrasiAndroid(this.registrasiAndroid.antrian);
        }
    }

    printAntrianRegistrasiAndroid(noAntrian: string){
        (<HTMLIFrameElement>document.getElementById('iframePrintSep')).src = config.api_vclaim('print/anjungan/nomor_antrian/android/' + noAntrian );
    }


}
