import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';

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
    sesi: any;
    peserta: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private captureService: NgxCaptureService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionPasien();
        this.registrasiOnlineService.getSessionPeserta();
        this.registrasiOnlineService.getSessionRujukan();
        this.registrasiOnlineService.getSessionJadwalDokter();
        this.registrasiOnlineService.getSessionJenisPembayaran();
        this.registrasiOnlineService.getSessionSesi();
        this.registrasiOnlineService.pasien.subscribe(data => this.handlePasien(data))
        this.registrasiOnlineService.rujukan.subscribe(data => this.rujukan = data)
        this.registrasiOnlineService.peserta.subscribe(data => this.peserta = data)
        this.registrasiOnlineService.suratKontrol.subscribe(data => this.suratKontrol = data)
        this.registrasiOnlineService.jadwalDokter.subscribe(data => this.jadwalDokter = data)
        this.registrasiOnlineService.jenisPembayaran.subscribe(data => this.jenisPembayaran = data)
        this.registrasiOnlineService.sesi.subscribe(data => this.sesi = data)
        this.registrasiOnlineService.dataHistorySep.subscribe(data => this.handleHistorySep(data))
        this.registrasiOnlineService.createSuratKontrolStatus.subscribe(data => this.handleCreateSuratKontrol(data) )
        this.registrasiOnlineService.dataBooking.subscribe(data => this.handleDataBooking(data))
        this.captureImage();
    }

    handlePasien(data:any){
        if( data ){
            this.pasien = data;
            this.registrasiOnlineService.getHistorySep(this.pasien.noaskes);
        }else{
            this.router.navigateByUrl('/')
        }
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

    handleHistorySep(data: any[]) {
        this.lastSep = '';

        if (data) {

            let obj : any = data.find((o: any) => o.poli.toUpperCase().replace(/^\s+|\s+$/gm,'') === this.jadwalDokter.namasubspesialis.toUpperCase().replace(/^\s+|\s+$/gm,'') && o.noRujukan === this.rujukan.noKunjungan);

            if( obj ){
                this.lastSep = obj;
            }

        }
    }

    handleCreateSuratKontrol(status: boolean){
        if( status ){
            this.save();
        }
    }

    handleDataBooking(data: any){
        if( data ){
            data.nama = this.pasien.nama;
            data.norekmed = this.pasien.norekmed;
            data.noaskes = this.pasien.noaskes;
            data.noRujukan = this.rujukan.noKunjungan;

            sessionStorage.setItem('booking', JSON.stringify(data));

            this.router.navigateByUrl('/registrasi/success');
        }
    }

    createSuratKontrol() {
        this.jenisKunjungan = { kode: 3, nama: 'kontrolKembali' };

        this.registrasiOnlineService.getListSuratKontrol(this.pasien.noaskes, this.jadwalDokter.tglKunjungan)
            .subscribe(data => {
                if( data ){
                    let obj : any = data.list.find((o: any) => o.poliTujuan.replace(/^\s+|\s+$/gm,'') === this.jadwalDokter.kodesubspesialis.replace(/^\s+|\s+$/gm,'') && o.terbitSEP.replace(/^\s+|\s+$/gm,'').toUpperCase() === 'BELUM');
                    if( obj ) {
                        this.updateSuratKontrol(obj);
                    }else{
                        this.newSuratKontrol();
                    }
                }else{
                    this.newSuratKontrol();
                }
            })
    }

    updateSuratKontrol(suratKontrol: any) {

        let data = {
            noSuratKontrol: suratKontrol.noSuratKontrol,
            noSep: suratKontrol.noSepAsalKontrol,
            dokter: this.jadwalDokter.kodedokter,
            poli: this.jadwalDokter.kodesubspesialis,
            tgl: this.jadwalDokter.tglKunjungan
        }

        this.registrasiOnlineService.updateSuratKontrol(data)
            .subscribe(data => {
                if( data ){
                    this.getSuratKontrol(suratKontrol);
                }
            })
    }

    getSuratKontrol(suratKontrol: any) {
        this.registrasiOnlineService.getSuratKontrol(suratKontrol.noSuratKontrol)
            .subscribe(data => {
                if( data ){
                    let suratKontrol = {
                        noSuratKontrol: data.noSuratKontrol,
                        tglRencanaKontrol: data.tglRencanaKontrol,
                        namaDokter: data.namaDokter,
                        noKartu: data.sep.peserta.noKartu,
                        nama: data.sep.peserta.nama,
                        kelamin: (data.sep.peserta.kelamin.toUpperCase() == 'P') ? 'PEREMPUAN' : 'LAKI-LAKI',
                        tglLahir: data.sep.peserta.tglLahir,
                        namaDiagnosa: data.sep.diagnosa,
                    }
                    sessionStorage.setItem('suratKontrol', JSON.stringify(suratKontrol));
                    this.suratKontrol = suratKontrol;

                    this.save();
                }
            })
    }

    newSuratKontrol(){
        let data = {
            noSep: this.lastSep.noSep,
            dokter: this.jadwalDokter.kodedokter,
            poli: this.jadwalDokter.kodesubspesialis,
            tgl: this.jadwalDokter.tglKunjungan
        }
        this.registrasiOnlineService.createSuratKontrol(data);
    }

    daftar() {
        this.registrasiOnlineService.validasiRegistrasi(this.pasien.id_pasien)
            .subscribe(data => {
                if( data ){
                    if( parseInt(this.rujukan.jumlahSep) > 0 ){
                        if( this.rujukan.poliRujukan.kode == this.jadwalDokter.kodesubspesialis ){
                            // Kontrol Kembali
                            this.createSuratKontrol();
                        }else{
                            // Rujukan Internal
                            this.jenisKunjungan = { kode: 2, nama: 'rujukanInternal' };
                            this.save();
                        }
                    }else{
                        // Rujukan Baru
                        this.jenisKunjungan = { kode: this.rujukan.asalFaskes.jenisKunjungan, nama: this.rujukan.asalFaskes.nama };
                        this.save();
                    }
                }
            })
    }

    save() {
        let data = {
            pasien: this.pasien,
            rujukan: this.rujukan,
            suratKontrol: this.suratKontrol,
            jadwalDokter: this.jadwalDokter,
            jenisPembayaran: this.jenisPembayaran,
            jenisKunjungan: this.jenisKunjungan,
            sesi: this.sesi,
            simrs: null
        }

        this.registrasiOnlineService.saveToSimrs(data)
            .subscribe(res => {
                if( res ){
                    data.simrs = res;
                    this.registrasiOnlineService.save(data);
                }
            })

    }

    toHome(){
        this.router.navigateByUrl('');
    }

}
