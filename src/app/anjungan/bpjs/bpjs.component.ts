import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { AnjunganService } from '../anjungan.service';
import { VirtualKeyboardService } from '../shared/components/virtual-keyboard/virtual-keyboard.service';

@Component({
    selector: 'app-bpjs',
    templateUrl: './bpjs.component.html',
    styleUrls: ['./bpjs.component.css']
})
export class BpjsComponent implements OnInit {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    pasien: any;
    peserta: any;
    jadwalDokter: any;
    rujukan: any;
    nomorBpjs: any;

    constructor(
        private router: Router,
        private keyboardService: VirtualKeyboardService,
        private errorMessageService: ErrorMessageService,
        public registrasiOnlineService: RegistrasiOnlineService,
        public anjunganService: AnjunganService
    ) { }

    ngOnInit(): void {
        this.onBlur();
        this.registrasiOnlineService.refreshForm();
        this.keyboardService.value.subscribe(data => this.nomorBpjs = data)
        this.keyboardService.enterAction.subscribe(data => { if (data) this.getPeserta(this.nomorBpjs) })
    }

    handlePasien(data: any) {
        if (data) {
            this.pasien = data;
            if (this.pasien.noaskes) {
                this.anjunganService.getPeserta(this.pasien.noaskes)
                this.anjunganService.peserta.subscribe(data => this.peserta = data )
            }else{
                this.errorMessageService.message('Nomor BPJS anda belum terinput.')
                this.keyboardService.clearAction();
            }
        }
    }

    listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.getPeserta(this.nomorBpjs);
        }
    }

    getPeserta(value: string) {
        if (value) {
            this.clearDataPasien();
            if( value.length == 6 ){
                this.registrasiOnlineService.getPasienByRm(value);
            }else{
                this.registrasiOnlineService.getPesertaBpjs(value.padStart(13, '0'));
            }
            this.registrasiOnlineService.dataPasien.subscribe(data => this.handlePasien(data))
        }
    }

    onBlur() {
        setTimeout(() => {
            if (this.searchElement) {
                this.searchElement.nativeElement.focus();
            }
        }, 200);
    }

    clearDataPasien() {
        this.registrasiOnlineService.dataPasien.next('');
        this.anjunganService.peserta.next('');
    }

    reset() {
        this.clearDataPasien();
        this.keyboardService.enterAction.next(false);
        this.keyboardService.clearAction();
    }

    home() {
        this.reset();
        this.router.navigateByUrl('anjungan');
    }

    next() {
        if(this.peserta.statusPeserta.kode == '0'){
            sessionStorage.setItem('pasien', JSON.stringify(this.pasien));
            sessionStorage.setItem('peserta', JSON.stringify(this.peserta));
            this.reset();
            this.router.navigateByUrl('anjungan/bpjs/rujukan');
        }
    }


}
