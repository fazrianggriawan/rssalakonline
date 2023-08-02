import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { AnjunganService } from '../anjungan.service';
import { VirtualKeyboardService } from '../shared/components/virtual-keyboard/virtual-keyboard.service';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    nomor: any;
    sep: any;
    dialogApprovalSep: boolean = false;
    validFingerPrint: boolean = true;

    formApproval!: FormGroup;

    subDataPasien: any;
    subEnter: any;
    subKey: any;


    constructor(
        private router: Router,
        private keyboardService: VirtualKeyboardService,
        private errorMessageService: ErrorMessageService,
        public registrasiOnlineService: RegistrasiOnlineService,
        public anjunganService: AnjunganService,
        private appService: AppService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initForm();
        sessionStorage.clear();
        this.onBlur();
        this.registrasiOnlineService.refreshForm();
        this.subKey = this.keyboardService.value.subscribe(data => this.nomor = data)
        this.subEnter = this.keyboardService.enterAction.subscribe(data => { if (data) this.getPasien(this.nomor) })
    }

    initForm() {
        this.formApproval = this.fb.group({
            tglSep: [new Date(), [Validators.required]],
            noKartu: [null, [Validators.required]],
            nama: [null, [Validators.required]],
            jnsPelayanan: ["2", [Validators.required]],
            jnsPengajuan: ["2", [Validators.required]],
            keterangan: ["SIDIK JARI TIDAK TERBACA", [Validators.required]],
            nama_pelayanan: ["RAWAT JALAN"],
            nama_pengajuan: ["PENGAJUAN FINGER PRINT"],
        })
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subKey.unsubscribe();
        this.subEnter.unsubscribe();
    }

    getHistorySep(noKartu: string){
        this.sep = '';
        this.registrasiOnlineService.getHistorySep(noKartu)
            .subscribe(data => {
                if( data ){
                    sessionStorage.setItem('history_sep', JSON.stringify(data));
                    let today = this.registrasiOnlineService.reformatDate(new Date());
                    data.forEach((item: any) => {
                        if( item.tglSep == today ){
                            this.sep = item;
                        }
                    });
                }
        }

        ngOnDestroy(): void {
            //Called once, before the instance is destroyed.
            //Add 'implements OnDestroy' to the class.
            this.subPeserta.unsubscribe();
            this.subKey.unsubscribe();
        }

        getHistorySep(noKartu: string){
            this.sep = '';
            this.registrasiOnlineService.getHistorySep(noKartu)
                .subscribe(data => {
                    if( data ){
                        sessionStorage.setItem('history_sep', JSON.stringify(data));

                        let today = this.registrasiOnlineService.reformatDate(new Date());
                        data.forEach((item: any) => {
                            if( item.tglSep == today ){
                                this.sep = item;
                            }
                        });

                    }
                })
        }

            })
    }

    listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.getPasien(this.nomor);
        }
    }

    getPasien(value: string) {
        if (value) {
            this.registrasiOnlineService.getPasien(value)
                .subscribe(data => {
                    if( data ){
                        if( data.noaskes != null ){
                            this.pasien = data;
                            this.getPeserta(this.pasien.noaskes);
                        }else{
                            this.keyboardService.clearAction();
                            this.errorMessageService.message('No.Kartu BPJS Tidak Ditemukan');
                        }
                    }else{
                        this.errorMessageService.message('Data Pasien Tidak Ditemukan');
                    }
                })
            }
        }

        getPasien(value: string) {
            if (value) {
                this.registrasiOnlineService.getPasien(value)
                    .subscribe(data => {
                        if( data ){
                            if( data.noaskes != null ){
                                this.registrasiOnlineService.getFingerPrint(data.noaskes, this.appService.reformatDate(new Date()))
                                    .subscribe(res => {
                                        if( res ){
                                            if( parseInt(res.response.kode) == 0 ){
                                                this.errorMessageService.message(res.response.status);
                                            }else{
                                                this.pasien = data;
                                                this.getPeserta(this.pasien.noaskes);
                                                this.getHistorySep(this.pasien.noaskes);
                                            }
                                        }
                                    })
                            }else{
                                this.keyboardService.clearAction();
                                this.errorMessageService.message('No.Kartu BPJS Tidak Ditemukan');
                            }
                        }else{
                            this.errorMessageService.message('Data Pasien Tidak Ditemukan');
                        }
                    })
            }
        }

        getPeserta(noaskes: string){
            this.registrasiOnlineService.getPeserta(noaskes)
                .subscribe(data => {
                    this.peserta = data;
                })
        }

        onBlur() {
            setTimeout(() => {
                if (this.searchElement) {
                    this.searchElement.nativeElement.focus();
                }
            }, 200);
        }

        reset() {
            sessionStorage.clear();
            this.registrasiOnlineService.dataPasien.next('');
            this.anjunganService.peserta.next('');
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
                this.router.navigateByUrl('anjungan/bpjs/rujukan');
            }
        }

        printSep(noSep: string){
            (<HTMLIFrameElement>document.getElementById('iframePrintSepOnly')).src = config.api_vclaim('sep/print/anjunganSepOnly/' + noSep );
        }


    }
            this.router.navigateByUrl('anjungan/bpjs/rujukan');
        }
    }

    printSep(noSep: string){
        this.appService.print(config.api_vclaim('sep/print/anjunganSepOnly/' + noSep ));
    }

    onShow(){
        this.formApproval.patchValue({
            noKartu: this.peserta.noKartu,
            nama: this.peserta.nama
        })
    }

    onHide(){
        this.initForm();
    }

}
