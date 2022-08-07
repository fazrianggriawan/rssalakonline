import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-jadwal-dokter',
    templateUrl: './jadwal-dokter.component.html',
    styleUrls: ['./jadwal-dokter.component.css']
})
export class JadwalDokterComponent implements OnInit {

    dataJadwalDokter: any;
    selectedJadwalDokter: any;
    dataPoli: any;
    gantiPoli: boolean = false;
    jadwalDokter: any;
    namaPoliTujuan: string = '';
    loading: boolean = false;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.loadingService.status.subscribe(data => this.loading = data)
        this.registrasiOnlineService.dataJadwalDokter.subscribe(data => this.dataJadwalDokter = data)
        this.registrasiOnlineService.dataPoliklinik.subscribe(data => this.dataPoli = data)
        this.registrasiOnlineService.getDataPoliklinik();
        this.getDataRujukan();
    }

    getDataRujukan() {
        let rujukan : any = sessionStorage.getItem('rujukan');
        let dataRujukan = JSON.parse(rujukan);
        this.namaPoliTujuan = dataRujukan.poliRujukan.nama;
        this.getJadwalDokter( dataRujukan.poliRujukan.kode )
    }

    getJadwalDokter(idPoli: string) {
        let tanggal = this.registrasiOnlineService.reformatDate(new Date())
        this.registrasiOnlineService.getJadwalDokter(idPoli, tanggal);
        this.gantiPoli = false;
    }

    selectGantiPoli(data: any){
        this.selectedJadwalDokter = '';
        this.jadwalDokter = '';
        this.getJadwalDokter(data.kode);
        this.namaPoliTujuan = data.ket
    }

    selectJadwal(data: any) {
        this.selectedJadwalDokter = data.kodedokter;
        this.jadwalDokter = data;
    }

    clearData() {
        this.registrasiOnlineService.dataJadwalDokter.next('')
        this.registrasiOnlineService.dataPoliklinik.next('')
        this.selectedJadwalDokter = '';
        this.jadwalDokter = '';
    }


    back() {
        this.clearData();
        sessionStorage.removeItem('rujukan');
        this.router.navigateByUrl('anjungan/bpjs/rujukan');
    }

    next() {
        this.jadwalDokter.tglKunjungan = this.registrasiOnlineService.reformatDate(new Date());
        sessionStorage.setItem('jadwalDokter', JSON.stringify(this.jadwalDokter));
        this.clearData();
        this.router.navigateByUrl('anjungan/bpjs/konfirmasi');
    }

}
