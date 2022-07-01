import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from '../registrasi-online.service';

@Component({
    selector: 'app-rencana-kunjungan',
    templateUrl: './rencana-kunjungan.component.html',
    styleUrls: ['./rencana-kunjungan.component.css']
})
export class RencanaKunjunganComponent implements OnInit {

    today = new Date();
    endDate: any;
    pasien: any;
    dialogDataJadwalDokter: boolean = false;
    dataPoliklinik: any;
    rujukan: any;
    tglKunjungan = new Date();
    tujuanPoli: string = '';
    dataJadwalDokter: any;
    jadwalDokter: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionPasien();
        this.registrasiOnlineService.getSessionRujukan();
        this.registrasiOnlineService.getSessionJadwalDokter();
        this.registrasiOnlineService.getDataPoliklinik();
        this.registrasiOnlineService.dataPoliklinik.subscribe(data => this.dataPoliklinik = data)
        this.registrasiOnlineService.dataJadwalDokter.subscribe(data => this.dataJadwalDokter = data)
        this.registrasiOnlineService.pasien.subscribe(data => this.handlePasien(data))
        this.registrasiOnlineService.rujukan.subscribe(data => this.handleSessionRujukan(data))
        this.registrasiOnlineService.jadwalDokter.subscribe(data => this.handleJadwalDokter(data));
    }

    handlePasien(data: any){
        if(data){
            this.pasien = data;
        }else{
            this.router.navigate(['/registrasiOnline']);
        }
    }

    handleJadwalDokter(data: any) {
        if (data) {
            this.jadwalDokter = data;
            this.setTujuanPoli(this.jadwalDokter.kodepoli);
        }
    }

    handleSessionRujukan(data: any) {
        if (data) {
            this.rujukan = data;
            this.endDate = new Date(data.expired.toString());
            this.setTujuanPoli(this.rujukan.poliRujukan.kode);
            this.getJadwalDokter();
        }
    }

    setTujuanPoli(data: any) {
        setTimeout(() => {
            this.tujuanPoli = data;
        }, 100);
    }

    changePoliklinik() {
        this.jadwalDokter = '';
        this.getJadwalDokter();
    }

    getJadwalDokter() {
        setTimeout(() => {
            if (this.tujuanPoli && this.tglKunjungan) {
                this.registrasiOnlineService.getJadwalDokter(this.tujuanPoli, this.registrasiOnlineService.reformatDate(this.tglKunjungan));
            }
        }, 100);
    }

    selectJadwal(item: any) {
        this.jadwalDokter = item;
        this.dialogDataJadwalDokter = false;
    }

    next() {
        this.jadwalDokter.tglKunjungan = this.registrasiOnlineService.reformatDate(this.tglKunjungan);
        sessionStorage.setItem('jadwalDokter', JSON.stringify(this.jadwalDokter));
        this.router.navigate(['registrasiOnline/konfirmasi']);
    }

}