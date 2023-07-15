import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RujukanService } from './rujukan.service';

@Component({
    selector: 'app-rujukan',
    templateUrl: './rujukan.component.html',
    styleUrls: ['./rujukan.component.css']
})
export class RujukanComponent implements OnInit {

    dataRujukan: any[] = [];
    dataRujukanFaskes: any;
    dataRujukanRs: any;
    selectedRujukan: any;
    rujukan: any;
    loading: boolean = false;
    totalRujukanAktif: number = 0;
    peserta: any;
    sepRujukan: any[] = [];
    noRujukan: any;
    dataHistorySep: any[] = [];
    dataSepRujukan: any[] = [];

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router,
        private loadingService: LoadingService,
        private rujukanService: RujukanService,
    ) { }

    ngOnInit(): void {
        this.loadingService.status.subscribe(data => this.loading = data)
        let peserta : any = sessionStorage.getItem('peserta');
        this.peserta = JSON.parse(peserta);
        this.getDataRujukan();
    }

    getRiwayatSep(){
        this.registrasiOnlineService.getHistorySep(this.peserta.noKartu)
            .subscribe(data => {
                this.dataHistorySep = data;
            })
    }

    getDataRujukan(){
        this.dataRujukan = [];
        this.rujukanService.getRujukanRS(this.peserta.noKartu)
            .subscribe(data => {
                this.dataRujukan = data;
                this.rujukanService.getRujukanFaskes(this.peserta.noKartu)
                    .subscribe(data => {
                        data.forEach((item: any) => {
                            this.dataRujukan.push(item);
                        });
                        this.validasiMasaBerlaku(this.dataRujukan);
                        this.getRiwayatSep();
                    })
            })
    }

    validasiMasaBerlaku(data: any[]){
        this.totalRujukanAktif = 0;
        data.forEach((item: any) => {
            if( this.registrasiOnlineService.getExpiredRujukan(item.tglKunjungan).hariExpired > 0 ){
                this.totalRujukanAktif++;
            }
        });
    }

    onSelectedRujukan(item: any){
        this.rujukan = item;
        this.noRujukan = item.noKunjungan;
        this.rujukan.expired = this.registrasiOnlineService.getExpiredRujukan(this.rujukan.tglKunjungan);
        sessionStorage.setItem('rujukan', JSON.stringify(this.rujukan));
        this.getJumlahSep(item.noKunjungan, 1);
        this.getSepRujukan();
    }

    getSepRujukan() {
        this.dataHistorySep.forEach((item: any) => {
            if( item.noRujukan == this.noRujukan ){
                this.dataSepRujukan.push(item)
            }
        });
        if(this.dataSepRujukan){
            sessionStorage.setItem('sep_rujukan', JSON.stringify(this.dataSepRujukan));
        }
    }

    getJumlahSep(noKunjungan: any, asalRujukan: any) {
        this.registrasiOnlineService.getJumlahSepByRujukan(noKunjungan, asalRujukan)
            .subscribe(data => {
                if( data ){
                    this.rujukan.jumlahSep = data
                }else{
                    if( asalRujukan == 1 ){
                        this.getJumlahSep(noKunjungan, 2)
                    }
                }
            })
    }

    back() {
        this.registrasiOnlineService.clearAllSession();
        this.router.navigateByUrl('anjungan/bpjs');
    }


    next() {
        this.router.navigateByUrl('anjungan/bpjs/jadwalDokter');
    }

}
