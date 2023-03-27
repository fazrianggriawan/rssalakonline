import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { AnjunganService } from '../anjungan.service';
import { VirtualKeyboardService } from '../shared/components/virtual-keyboard/virtual-keyboard.service';

@Component({
    selector: 'app-bpjs',
    templateUrl: './bpjs.component.html',
    styleUrls: ['./bpjs.component.css']
})
export class BpjsComponent implements OnInit, OnDestroy {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    pasien: any;
    peserta: any;
    jadwalDokter: any;
    rujukan: any;
    nomorBpjs: any;
    sep: any;

    subDataPasien: any;
    subPeserta: any;
    subKey: any;

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
        this.subKey = this.keyboardService.value.subscribe(data => this.nomorBpjs = data)
        this.keyboardService.enterAction.subscribe(data => { if (data) this.getPeserta(this.nomorBpjs) })
        this.subPeserta = this.anjunganService.peserta.subscribe(data => this.peserta = data )
        this.subDataPasien = this.registrasiOnlineService.dataPasien.subscribe(data => this.handlePasien(data))
        this.registrasiOnlineService.dataHistorySep.subscribe(data => this.handleHistorySep(data))
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subDataPasien.unsubscribe();
        this.subPeserta.unsubscribe();
        this.subKey.unsubscribe();
    }

    handlePasien(data: any) {
        if (data) {
            this.pasien = data;
            this.sep = '';
            if (this.pasien.noaskes) {
                this.anjunganService.getPeserta(this.pasien.noaskes)
                this.registrasiOnlineService.getHistorySep(this.pasien.noaskes)
            }else{
                this.errorMessageService.message('Nomor BPJS anda belum terinput.')
                this.keyboardService.clearAction();
            }
        }
    }

    handleHistorySep(data: any) {
        if(data){
            let today = this.registrasiOnlineService.reformatDate(new Date());
            data.forEach((item: any) => {
                if( item.tglSep == today ){
                    this.sep = item;
                }
            });
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

            this.registrasiOnlineService.getPasien(value)
                .subscribe(data => {
                    data.norekmed = data.KODE;
                    data.noaskes = data.NOASKES;
                    data.nama = data.NAMA;
                    data.kelamin = data.KELAMIN;
                    data.alamat = data.ALAMAT1;
                    data.tlp = data.TELP;
                    if( data.noaskes != null ){
                        this.registrasiOnlineService.dataPasien.next(data);
                    }else{
                        this.errorMessageService.message('No.Kartu BPJS Tidak Ditemukan');
                    }
                })
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

    printSep(noSep: string){
        (<HTMLIFrameElement>document.getElementById('iframePrintSepOnly')).src = config.api_vclaim('sep/print/anjunganSepOnly/' + noSep );
    }


}
