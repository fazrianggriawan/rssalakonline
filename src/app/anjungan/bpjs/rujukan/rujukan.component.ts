import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RujukanService } from './rujukan.service';
import { AppService } from 'src/app/services/app.service';

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
    jns_kunjungan: any;
    tanggal: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router,
        private loadingService: LoadingService,
        private rujukanService: RujukanService,
        private appService: AppService,
    ) { }

    ngOnInit(): void {
        this.dataRujukan = [];
        this.tanggal = this.appService.reformatDate(new Date())
        this.loadingService.status.subscribe(data => this.loading = data)
        let peserta : any = sessionStorage.getItem('peserta');
        this.peserta = JSON.parse(peserta);
        this.getDataRujukan();
    }

    getRiwayatSep(){
        let history : any = sessionStorage.getItem('history_sep');
        this.dataHistorySep = JSON.parse(history);

        if( parseInt(this.dataHistorySep[0].jnsPelayanan) == 1 ){ // Jika SEP Terakhir adalah Rawat Inap
            this.jns_kunjungan = { tujuanKunj: '0', assessmentPel: '', name: 'kontrol' }
            sessionStorage.setItem('jns_kunjungan', JSON.stringify(this.jns_kunjungan));
            let sep : any = this.dataHistorySep[0];
            let diagnosa = sep.diagnosa.split(' - ');
            this.dataRujukan.push({
                noKunjungan: sep.noSep,
                tglKunjungan: sep.tglSep,
                poliRujukan: {  kode: '', nama: 'KONTROL RAWAT INAP' },
                provPerujuk: { kode: 'ranap', nama: sep.ppkPelayanan },
                diagnosa: { kode: diagnosa[0], nama: diagnosa[1] },
                asalFaskes: {
                    kode: 'ranap',
                    nama: 'Rawat Inap',
                    jenisKunjungan: 0
                }
            })
            console.log(this.dataRujukan);
            this.totalRujukanAktif++;
        }
    }

    getDataRujukan(){
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
        if( this.rujukan.asalFaskes.kode != 'ranap' ){
            this.getJumlahSep(item.noKunjungan, 1);
        }else{
            this.getSepRujukanWatnap(this.dataHistorySep);
        }
        this.getSepRujukan();
    }

    getSepRujukanWatnap(dataHistorySep: any[]) {
        let sep : any[] = [];
        dataHistorySep.forEach((element: any) => {
            if( element.jnsPelayanan == "1" && element.ppkPelayanan == 'RS SALAK' ){
                sep.push(element);
            }
        });

        if( sep.length > 0 ){
            this.dataSepRujukan.push(sep[0])
        }

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
        sessionStorage.setItem('rujukan', JSON.stringify(this.rujukan));
        this.router.navigateByUrl('anjungan/bpjs/jadwalDokter');
    }

}
