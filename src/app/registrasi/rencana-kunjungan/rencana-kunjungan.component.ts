import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';

@Component({
    selector: 'app-rencana-kunjungan',
    templateUrl: './rencana-kunjungan.component.html',
    styleUrls: ['./rencana-kunjungan.component.css']
})
export class RencanaKunjunganComponent implements OnInit, OnDestroy {

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

    subPasien: any;
    subRujukan: any;
    subJadwalDokter: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionRujukan();
        this.registrasiOnlineService.getSessionJadwalDokter();
        this.registrasiOnlineService.getDataPoliklinik();
        this.registrasiOnlineService.getSessionPasien();
        this.subPasien = this.registrasiOnlineService.pasien.subscribe(data => this.handlePasien(data))
        this.registrasiOnlineService.dataPoliklinik.subscribe(data => this.dataPoliklinik = data)
        this.registrasiOnlineService.dataJadwalDokter.subscribe(data => this.dataJadwalDokter = data)
        this.subJadwalDokter = this.registrasiOnlineService.jadwalDokter.subscribe(data => this.handleJadwalDokter(data));
        this.subRujukan = this.registrasiOnlineService.rujukan.subscribe(data => this.handleSessionRujukan(data))
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subPasien.unsubscribe();
        this.subRujukan.unsubscribe();
        this.subJadwalDokter.unsubscribe();
    }

    handleJadwalDokter(data: any){
        this.jadwalDokter = data;
        if(data){
            this.tglKunjungan = new Date(data.tglKunjungan);
        }else{
            this.tglKunjungan =  new Date();
        }
    }

    handlePasien(data: any){
        if(data){
            this.pasien = data;
        }else{
            this.router.navigateByUrl('/')
        }
    }

    handleSessionRujukan(data: any) {
        if (data) {
            this.rujukan = data;
            this.endDate = new Date(data.expired.toString());

            if (this.jadwalDokter) {
                this.setTujuanPoli(this.jadwalDokter.kodepoli);
            }else{
                this.setTujuanPoli(this.rujukan.poliRujukan.kode);
            }
        }
    }

    setTujuanPoli(data: any) {
        setTimeout(() => {
            this.tujuanPoli = data;
            this.getJadwalDokter();
        }, 500);
    }

    changePoliklinik() {
        this.jadwalDokter = '';
        this.getJadwalDokter();
    }

    getJadwalDokter() {
        if (this.tujuanPoli && this.tglKunjungan) {
            setTimeout(() => {
                console.log(this.tglKunjungan);
                this.registrasiOnlineService.getJadwalDokter(this.tujuanPoli, this.registrasiOnlineService.reformatDate(this.tglKunjungan));
            }, 250);
        }
    }

    selectJadwal(item: any) {
        this.jadwalDokter = item;
        this.dialogDataJadwalDokter = false;
    }

    next() {
        this.jadwalDokter.tglKunjungan = this.registrasiOnlineService.reformatDate(this.tglKunjungan);
        sessionStorage.setItem('jadwalDokter', JSON.stringify(this.jadwalDokter));
        this.router.navigateByUrl('registrasi/konfirmasi');
    }

}
