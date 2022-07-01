import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from '../registrasi-online.service';

@Component({
    selector: 'app-jenis-kunjungan',
    templateUrl: './jenis-kunjungan.component.html',
    styleUrls: ['./jenis-kunjungan.component.css']
})
export class JenisKunjunganComponent implements OnInit {

    pasien: any;
    dataRujukan: any;
    dialogDataRujukan: boolean = false;
    rujukan: any;
    jnsPembayaran: string = '';
    jnsKunjungan: string = '';
    jumlahSepRujukan: string = '';

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionPasien();
        this.registrasiOnlineService.dataRujukan.subscribe(data => this.dataRujukan = data)
        this.registrasiOnlineService.jumlahSepRujukan.subscribe(data => this.handleJumlahSepRujukan(data))
        this.registrasiOnlineService.pasien.subscribe(data => this.handlePasien(data))
        this.getRujukan();
    }

    handlePasien(data: any){
        if(data){
            this.pasien = data;
            this.registrasiOnlineService.getDataRujukan(this.pasien.noaskes);
            if( this.pasien.noaskes ){
                this.jnsPembayaran = 'bpjs';
            }
        }else{
            this.router.navigate(['/registrasiOnline']);
        }
    }

    getRujukan() {
        let rujukan: any = sessionStorage.getItem('rujukan');
        if( rujukan ){
            this.rujukan = JSON.parse(rujukan);
            this.registrasiOnlineService.getJumlahSepRujukan(this.rujukan.noKunjungan);
        }
    }

    handleJumlahSepRujukan(data: any){
        this.jumlahSepRujukan = data;
        if( parseInt(data) > 0 ){
            this.jnsKunjungan = 'kontrolKembali';
        }else{
            this.jnsKunjungan = 'rujukanBaru';
        }
    }

    selectRujukan(rujukan: any) {
        this.rujukan = rujukan;
        this.dialogDataRujukan = false;
        this.registrasiOnlineService.getJumlahSepRujukan(this.rujukan.noKunjungan);

        let tanggal = this.rujukan.tglKunjungan.split('-');
        let tglRujukan = new Date(tanggal[0], tanggal[1]-1, tanggal[2]);
        let expiredDate = new Date(tglRujukan.setDate(tglRujukan.getDate()+90));

        let start =  new Date(this.registrasiOnlineService.reformatDate(new Date()));
        let end = new Date(this.registrasiOnlineService.reformatDate(expiredDate));

        let Time = end.getTime() - start.getTime();
        let Days = Time / (1000 * 3600 * 24); //Diference in Days

        this.rujukan.expired = this.registrasiOnlineService.reformatDate(expiredDate);
        this.rujukan.hariExpired = Days;

    }

    next() {
        this.rujukan.jumlahSep = this.jumlahSepRujukan;
        sessionStorage.setItem('rujukan', JSON.stringify(this.rujukan));
        sessionStorage.setItem('jenisPembayaran', this.jnsPembayaran);
        this.router.navigate(['/registrasiOnline/rencana-kunjungan']);
    }

}