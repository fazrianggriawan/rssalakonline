import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-rujukan',
    templateUrl: './rujukan.component.html',
    styleUrls: ['./rujukan.component.css']
})
export class RujukanComponent implements OnInit {

    dataRujukan: any;
    selectedRujukan: any;
    rujukan: any;
    loading: boolean = false;
    totalRujukanAktif: number = 0;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.loadingService.status.subscribe(data => this.loading = data)
        this.getRujukan();
    }

    hitungTotalRujukanAktif(i: number){
        this.totalRujukanAktif = this.totalRujukanAktif + 1;
    }

    getRujukan() {
        this.totalRujukanAktif = 0;
        this.registrasiOnlineService.dataRujukan.next('');
        let pasien : any = sessionStorage.getItem('pasien');
        this.registrasiOnlineService.getDataRujukan(JSON.parse(pasien).noaskes);
        this.registrasiOnlineService.dataRujukan.subscribe(data => this.handleDataRujukan(data));
    }

    handleDataRujukan(data: any){
        this.dataRujukan = data;
        if(data){
            data.forEach((item:any) => {
                if( this.registrasiOnlineService.getExpiredRujukan(item.tglKunjungan).hariExpired > 0 ){
                    this.totalRujukanAktif++;
                }
            });
        }
    }


    selectRujukan(data: any){
        this.selectedRujukan = data.noKunjungan;
        this.rujukan = data;

        this.registrasiOnlineService.getJumlahSepRujukan(data.noKunjungan)

        this.registrasiOnlineService.jumlahSepRujukan.subscribe(data => this.rujukan.jumlahSep = data)
    }

    clearData() {
        this.registrasiOnlineService.dataRujukan.next('');
        this.selectedRujukan = '';
        this.rujukan = '';
    }

    back() {
        this.clearData();
        this.registrasiOnlineService.clearAllSession();
        this.router.navigateByUrl('anjungan/bpjs');
    }


    next() {
        this.rujukan.expired = this.registrasiOnlineService.getExpiredRujukan(this.rujukan.tglKunjungan).expired;
        this.rujukan.hariExpired = this.registrasiOnlineService.getExpiredRujukan(this.rujukan.tglKunjungan).hariExpired;
        sessionStorage.setItem('rujukan', JSON.stringify(this.rujukan));
        this.clearData();
        this.router.navigateByUrl('anjungan/bpjs/jadwalDokter');
    }

}
