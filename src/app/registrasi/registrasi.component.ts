import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from '../registrasi-online/registrasi-online.service';
import { ErrorMessageService } from '../services/error-message.service';

@Component({
    selector: 'app-registrasi',
    templateUrl: './registrasi.component.html',
    styleUrls: ['./registrasi.component.css']
})
export class RegistrasiComponent implements OnInit, OnDestroy {

    pasien: any;
    peserta: any;
    nomorPasien: string = '';
    statusPeserta: string = '';
    dataSesiKunjungan: any[] = [];
    sesiKunjungan: any;
    subDataPasien : any;

    constructor(
        private registrasiOnlineService: RegistrasiOnlineService,
        private router: Router,
        private errorMessageService: ErrorMessageService
    ) { }

    ngOnInit(): void {
        if (location.protocol == 'https:') {
            location.replace(`http:${location.href.substring(location.protocol.length)}`);
        }

        this.clearData();
        this.subDataPasien = this.registrasiOnlineService.dataPasien.subscribe(data => this.handlePasien(data));
        this.registrasiOnlineService.peserta.subscribe(data => this.handleDataPeserta(data))
        this.initMaster();
    }

    initMaster() {
        this.dataSesiKunjungan = [
            { id: '1', name: 'Sesi 1 - 07:00 s.d. 09:00', start: '07:00', end: '09:00' },
            { id: '2', name: 'Sesi 2 - 09:00 s.d. 11:00', start: '09:00', end: '11:00' },
            { id: '3', name: 'Sesi 3 - 11:00 s.d. 12:00', start: '11:00', end: '12:00' },
        ]
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subDataPasien.unsubscribe();
    }

    handlePasien(data: any){
        this.pasien = data;
        if( data ){
            this.registrasiOnlineService.getPeserta(this.pasien.noaskes);
        }
    }

    handleDataPeserta(data: any){
        if(data){
            this.peserta = data;
            this.statusPeserta = this.peserta.statusPeserta.kode;
        }
    }

    getPasien() {
        this.clearData();
        if (this.nomorPasien.length > 3) {
            this.registrasiOnlineService.getPasien(this.nomorPasien)
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

    clearData(){
        this.statusPeserta = '';
        this.registrasiOnlineService.dataPasien.next('');
        this.registrasiOnlineService.peserta.next('');
        sessionStorage.clear();
    }

    next() {
        let pasien = JSON.stringify(this.pasien);
        let peserta = JSON.stringify(this.peserta);
        let sesi = JSON.stringify(this.sesiKunjungan);

        sessionStorage.setItem('pasien', pasien);
        sessionStorage.setItem('peserta', peserta);

        this.pasien = '';

        this.router.navigateByUrl('registrasi/jenis-kunjungan')
    }

    onChangeSesi(e: any){
        let obj : any = this.dataSesiKunjungan.find((o: any) => o.id === e);
        this.sesiKunjungan = obj;
    }

}
