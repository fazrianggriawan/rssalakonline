import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrasiOnlineService } from '../registrasi-online.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
    selector: 'app-konfirmasi',
    templateUrl: './konfirmasi.component.html',
    styleUrls: ['./konfirmasi.component.css']
})
export class KonfirmasiComponent implements OnInit {

    @ViewChild('screen', { static: true }) screen: any;

    jadwalDokter: any;
    rujukan: any;
    pasien: any;
    lastSep: any;
    jenisPembayaran: any;
    suratKontrol: any;
    jenisKunjungan: any;
    dataBooking: any;
    imageCapture: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private captureService: NgxCaptureService,
        private router: Router,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionPasien();
        this.registrasiOnlineService.getSessionRujukan();
        this.registrasiOnlineService.getSessionJadwalDokter();
        this.registrasiOnlineService.getSessionJenisPembayaran();
        this.registrasiOnlineService.pasien.subscribe(data => this.pasien = data)
        this.registrasiOnlineService.rujukan.subscribe(data => this.rujukan = data)
        this.registrasiOnlineService.suratKontrol.subscribe(data => this.suratKontrol = data)
        this.registrasiOnlineService.jadwalDokter.subscribe(data => this.jadwalDokter = data)
        this.registrasiOnlineService.jenisPembayaran.subscribe(data => this.jenisPembayaran = data)
        this.registrasiOnlineService.dataHistorySep.subscribe(data => this.handleHistorySep(data))
        this.registrasiOnlineService.getHistorySep(this.pasien.noaskes);
        this.registrasiOnlineService.createSuratKontrolStatus.subscribe(data => this.handleCreateSuratKontrol(data) )
        this.registrasiOnlineService.saveStatus.subscribe(data => this.handleSaveStatus(data))
        this.captureImage();
    }

    captureImage(){
        setTimeout(() => {
            this.captureService.getImage(this.screen.nativeElement, true)
            .pipe(
                tap(img => {
                    this.imageCapture = img;
                })
            ).subscribe();
        }, 100);

    }

    handleHistorySep(data: any) {
        this.lastSep = '';
        if (data) {
            let sepRujukan: any = [];
            data.forEach((element: any) => {
                if (element.noRujukan == this.rujukan.noKunjungan) {
                    sepRujukan.push(element);
                }
            });
            if( sepRujukan.length > 0 ){
                this.lastSep = sepRujukan[0];
            }
        }
    }

    handleCreateSuratKontrol(status: boolean){
        if( status ){
            this.jenisKunjungan = { kode: 3, nama: 'kontrolKembali' };
            this.save();
        }
    }

    handleSaveStatus(data: any){
        this.loadingService.status.next(false);
        if( data ){
            this.router.navigateByUrl('/registrasiOnline/success');
        }
    }

    createSuratKontrol() {
        let data = {
            noSep: this.lastSep.noSep,
            dokter: this.jadwalDokter.kodedokter,
            poli: this.jadwalDokter.kodepoli,
            tgl: this.jadwalDokter.tglKunjungan
        }

        this.registrasiOnlineService.createSuratKontrol(data);

    }

    next() {
        if( this.rujukan.poliRujukan.kode == this.jadwalDokter.kodepoli ){
            // Rencana Kontrol
            this.createSuratKontrol();
        }else{
            if( parseInt(this.rujukan.jumlahSep) > 0 ){
                // Rujukan Internal
                this.jenisKunjungan = { kode: 2, nama: 'rujukanInternal' };
            }else{
                // Rujukan Baru
                this.jenisKunjungan = { kode: this.rujukan.asalFaskes.jenisKunjungan, nama: this.rujukan.asalFaskes.nama };
            }
            this.save();
        }
    }

    save() {
        this.loadingService.status.next(true);
        let data = {
            pasien: this.pasien,
            rujukan: this.rujukan,
            suratKontrol: this.suratKontrol,
            jadwalDokter: this.jadwalDokter,
            jenisPembayaran: this.jenisPembayaran,
            jenisKunjungan: this.jenisKunjungan
        }

        this.registrasiOnlineService.save(data);
    }

}
