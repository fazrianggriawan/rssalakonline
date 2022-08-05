import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { AnjunganService } from '../services/anjungan.service';
import { KeyboardService } from '../services/keyboard.service';

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
        private keyboardService: KeyboardService,
        public registrasiOnlineService: RegistrasiOnlineService,
        public anjunganService: AnjunganService
    ) { }

    ngOnInit(): void {
        this.onBlur();
        this.registrasiOnlineService.clearAllSession();
        this.keyboardService.value.subscribe(data => this.nomorBpjs = data)
        this.keyboardService.enterAction.subscribe(data => { if (data) this.getPeserta(this.nomorBpjs) })
    }

    handlePasien(data: any) {
        if (data) {
            this.pasien = data;
            if (this.pasien.noaskes) {
                this.anjunganService.getPeserta(this.pasien.noaskes)
                this.anjunganService.peserta.subscribe(data => this.peserta = data )
            }
        }
    }

    listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.getPeserta(this.nomorBpjs);
        }
    }

    getPeserta(nomorBpjs: string) {
        if (nomorBpjs) {
            this.clearDataPasien();
            this.registrasiOnlineService.getPesertaBpjs(nomorBpjs);
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
        this.registrasiOnlineService.dataPasien.next(false);
        this.anjunganService.peserta.next(false);
    }

    reset() {
        this.clearDataPasien();
        this.keyboardService.enterAction.next(false);
        this.keyboardService.value.next('');
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
