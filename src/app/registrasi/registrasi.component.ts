import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from '../registrasi-online/registrasi-online.service';

@Component({
    selector: 'app-registrasi',
    templateUrl: './registrasi.component.html',
    styleUrls: ['./registrasi.component.css']
})
export class RegistrasiComponent implements OnInit {

    pasien: any;
    peserta: any;
    nomorPasien: string = '';
    statusPeserta: string = '';

    constructor(
        private registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.clearData();
        this.registrasiOnlineService.dataPasien.subscribe(data => this.handlePasien(data));
        this.registrasiOnlineService.peserta.subscribe(data => this.handleDataPeserta(data))
    }

    handlePasien(data: any){
        if( data ){
            this.pasien = data;
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
        this.registrasiOnlineService.pasien.next('');
        this.registrasiOnlineService.peserta.next('');
        sessionStorage.clear();
    }

    next() {
        this.clearData();
        let pasien = JSON.stringify(this.pasien);
        let peserta = JSON.stringify(this.peserta);

        sessionStorage.setItem('pasien', pasien);
        sessionStorage.setItem('peserta', peserta);

        this.pasien = '';

        this.router.navigateByUrl('registrasi/jenis-kunjungan')
    }

}
