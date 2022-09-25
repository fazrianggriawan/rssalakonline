import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AnjunganService } from '../anjungan.service';

@Component({
    selector: 'app-nomor-antrian',
    templateUrl: './nomor-antrian.component.html',
    styleUrls: ['./nomor-antrian.component.css']
})
export class NomorAntrianComponent implements OnInit {

    antrian : any = {
        tni: '0',
        bpjs: '0',
        tunai: '0'
    }

    defaultAntrian : string  = '11';
    defaultAntrianTni : string  = '1';

    today = new Date();

    constructor(
        public router: Router,
        private registrasiOnlineService: RegistrasiOnlineService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.checkLocalStorage()
    }

    checkLocalStorage() {
        if (localStorage.getItem('date')) {
            let dateToday = this.registrasiOnlineService.reformatDate(new Date());
            if (dateToday !== localStorage.getItem('date')) {
                this.reset();
            }else{
                this.antrian.tni = localStorage.getItem('tni');
                this.antrian.bpjs = localStorage.getItem('bpjs');
                this.antrian.tunai = localStorage.getItem('tunai');
            }
        } else {
            this.reset();
        }
    }

    reset() {
        let tanggal: string = this.registrasiOnlineService.reformatDate(new Date());
        localStorage.setItem('date', tanggal);

        let h : any = this.today.getHours();

        if( parseInt(h) <= 12 ){
            this.antrian.tni = this.defaultAntrianTni
        }else{
            this.antrian.tni = this.defaultAntrian
        }

        this.antrian.bpjs = this.defaultAntrian
        this.antrian.tunai = this.defaultAntrian

        localStorage.setItem('tni', this.antrian.tni)
        localStorage.setItem('bpjs', this.antrian.bpjs)
        localStorage.setItem('tunai', this.antrian.tunai)
    }

    getAntrianTni() {
        this.printAntrian('tni', this.antrian.tni)
        let antrian : number = parseInt(this.antrian.tni) + 1;
        this.antrian.tni = antrian.toString();
        localStorage.setItem('tni', this.antrian.tni);
    }

    getAntrianBpjs() {
        this.printAntrian('bpjs', this.antrian.bpjs)
        let antrian : number = parseInt(this.antrian.bpjs) + 1;
        this.antrian.bpjs = antrian.toString();
        localStorage.setItem('bpjs', this.antrian.bpjs);
    }

    getAntrianTunai() {
        this.printAntrian('tunai', this.antrian.tunai)
        let antrian : number = parseInt(this.antrian.tunai) + 1;
        this.antrian.tunai = antrian.toString();
        localStorage.setItem('tunai', this.antrian.tunai);
    }

    printAntrian(tipe:string, noAntrian:string){
        this.loadingService.status.next(true);
        (<HTMLIFrameElement>document.getElementById('iframePrint')).src = config.api_vclaim('print/anjungan/nomor_antrian/' + tipe + '/' + noAntrian);
        setTimeout(() => {
            this.loadingService.status.next(false);
        }, 500);
    }


    back() {
        this.router.navigateByUrl('/anjungan');
    }

}
