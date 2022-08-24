import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from '../registrasi-online/registrasi-online.service';

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

    subDataPasien : any;

    constructor(
        private registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.clearData();
        this.subDataPasien = this.registrasiOnlineService.dataPasien.subscribe(data => this.handlePasien(data));
        this.registrasiOnlineService.peserta.subscribe(data => this.handleDataPeserta(data))
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
        if (this.nomorPasien.length > 10) {
            this.registrasiOnlineService.getPesertaBpjs(this.nomorPasien);
        } else {
            this.registrasiOnlineService.getPasienByRm(this.nomorPasien);
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

        sessionStorage.setItem('pasien', pasien);
        sessionStorage.setItem('peserta', peserta);

        this.pasien = '';

        this.router.navigateByUrl('registrasi/jenis-kunjungan')
    }

}
