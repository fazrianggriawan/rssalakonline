import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';

@Component({
    selector: 'app-jenis-kunjungan',
    templateUrl: './jenis-kunjungan.component.html',
    styleUrls: ['./jenis-kunjungan.component.css']
})
export class JenisKunjunganComponent implements OnInit {

    pasien: any;
    dataRujukan: any[] = [];
    dialogDataRujukan: boolean = false;
    rujukan: any;
    jnsPembayaran: string = '';
    jnsKunjungan: string = '';
    jumlahSepRujukan: string = '';
    totalRujukanAktif: number = 0;

    subPasien: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionPasien();
        this.registrasiOnlineService.dataRujukanFaskes.subscribe(data => this.handleDataRujukan(data))
        this.registrasiOnlineService.dataRujukanRs.subscribe(data => this.handleDataRujukan(data))
        this.registrasiOnlineService.jumlahSepRujukan.subscribe(data => this.handleJumlahSepRujukan(data))
        this.subPasien = this.registrasiOnlineService.pasien.subscribe(data => this.handlePasien(data))
        this.getRujukan();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subPasien.unsubscribe();
    }

    handleDataRujukan(data: any){
        if(data){
            data.forEach((item:any) => {
                this.dataRujukan.push(item)
            });
        }
    }

    handlePasien(data: any){
        if(data){
            this.pasien = data;
            this.getDataRujukan();
            // this.registrasiOnlineService.getDataRujukan(this.pasien.noaskes);
            if( this.pasien.noaskes ){
                this.jnsPembayaran = 'bpjs';
            }
        }else{
            this.router.navigateByUrl('/');
        }
    }

    getDataRujukan(){
        this.registrasiOnlineService.getListRujukan(this.pasien.noaskes, 'faskes')
            .subscribe(data => {
                if( data ){
                    this.dataRujukan = data;
                }else{
                    this.registrasiOnlineService.getListRujukan(this.pasien.noaskes, 'rs')
                        .subscribe(data2 => {
                            if( data2 ){
                                data2.forEach((element: any) => {
                                    this.dataRujukan.push(element);
                                });
                            }
                        })
                }
            })
    }

    getRujukan() {
        let rujukan: any = sessionStorage.getItem('rujukan');
        if( rujukan ){
            this.rujukan = JSON.parse(rujukan);
            this.getJumlahSep(this.rujukan.noKunjungan, 1)
        }
    }

    getJumlahSep(noKunjungan: any, asalRujukan: any) {
        this.registrasiOnlineService.getJumlahSepByRujukan(noKunjungan, asalRujukan)
            .subscribe(data => {
                if( data ){
                    this.registrasiOnlineService.jumlahSepRujukan.next(data)
                }else{
                    if( asalRujukan == 1 ){
                        this.getJumlahSep(noKunjungan, 2)
                    }
                }
            })
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
        this.getJumlahSep(this.rujukan.noKunjungan, 1);
        // this.registrasiOnlineService.getJumlahSepRujukan(this.rujukan.noKunjungan);

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
        this.router.navigateByUrl('registrasi/rencana-kunjungan')
    }

}
