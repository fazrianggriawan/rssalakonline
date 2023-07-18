import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { LoadingService } from 'src/app/services/loading.service';
import { JadwalDokterService } from './jadwal-dokter.service';

@Component({
    selector: 'app-jadwal-dokter',
    templateUrl: './jadwal-dokter.component.html',
    styleUrls: ['./jadwal-dokter.component.css']
})
export class JadwalDokterComponent implements OnInit {

    dataJadwalDokter: any[] = [];
    selectedJadwalDokter: any;
    dataPoli: any[] = [];
    gantiPoli: boolean = false;
    jadwalDokter: any;
    namaPoliTujuan: string = '';
    loading: boolean = false;
    kodeDokter: any;
    rujukan: any;
    jns_kunjungan: any;
    tanggal: any;
    sep_rujukan: any;
    pasien: any;
    dataSuratKontrol: any[] = [];
    pelaksana: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private router: Router,
        private loadingService: LoadingService,
        private errorMessageService: ErrorMessageService,
        private jadwalDokterService: JadwalDokterService,
    ) { }

    ngOnInit(): void {
        this.loadingService.status.subscribe(data => this.loading = data)
        this.tanggal = this.registrasiOnlineService.reformatDate(new Date())
        this.initSessionStorage();
        this.getMasterPoli();
        this.getRujukan();
    }

    initSessionStorage() {
        let sep_rujukan : any = sessionStorage.getItem('sep_rujukan');
        this.sep_rujukan = JSON.parse(sep_rujukan);
        let jns_kunjungan : any = sessionStorage.getItem('jns_kunjungan');
        let pasien : any = sessionStorage.getItem('pasien');
        this.pasien = JSON.parse(pasien);
        this.jns_kunjungan = JSON.parse(jns_kunjungan);
    }

    getRujukan() {
        let rujukan : any = sessionStorage.getItem('rujukan');
        this.rujukan = JSON.parse(rujukan);
        if( this.rujukan.asalFaskes.kode == 'ranap' ){
            this.gantiPoli = true;
        }else{
            this.namaPoliTujuan = this.rujukan.poliRujukan.nama;
            this.getJadwalDokter( this.rujukan.poliRujukan.kode )
        }
    }

    getMasterPoli(){
        this.registrasiOnlineService.getDataPoliklinik()
            .subscribe(data => {
                this.dataPoli = data;
            })
    }

    getJadwalDokter(idPoli: string) {
        if( idPoli != '' ){
            this.registrasiOnlineService.getJadwalDokter(idPoli, this.tanggal)
                .subscribe(data => {
                    this.dataJadwalDokter = data;
                })
            this.gantiPoli = false;
        }
    }

    onSelectedGantiPoli(data: any){
        this.selectedJadwalDokter = '';
        this.jadwalDokter = '';
        this.namaPoliTujuan = data.ket;
        this.jns_kunjungan.name = 'kontrol';
        this.getJadwalDokter(data.kode);
        this.gantiPoli = false;
    }

    onSelectedJadwal(item: any) {
        this.jadwalDokter = item;
        this.kodeDokter = item.kodedokter;
        sessionStorage.setItem('jadwal_dokter', JSON.stringify(item))
        this.checkJenisKunjungan()
        this.getDefaultPelaksana();
    }

    getDefaultPelaksana() {
        this.jadwalDokterService.getDefaultPelaksana(this.jadwalDokter)
            .subscribe(data => {
                this.pelaksana = data;
            })
    }

    checkJenisKunjungan() {
        if( this.rujukan.asalFaskes.kode != 'ranap' ) {
            if( parseInt(this.rujukan.jumlahSep) == 0 ){
                this.jns_kunjungan = { tujuanKunj: '0', assessmentPel: '', name: 'rujukan_baru' } // Rujukan Baru
            }else{
                if( this.jadwalDokter.kodepoli == this.rujukan.poliRujukan.kode ){
                    this.jns_kunjungan = { tujuanKunj: '2', assessmentPel: '5', name: 'kontrol' } // Kontrol
                }else{
                    this.jns_kunjungan = { tujuanKunj: '0', assessmentPel: '1', name: 'rujukan_internal' } // Rujukan Internal
                }
            }
        }
        sessionStorage.setItem('jns_kunjungan', JSON.stringify(this.jns_kunjungan));
    }

    createSuratKontrol() {

        let data = {
            noSep: this.getSepRujukan(),
            dokter: this.jadwalDokter.kodedokter,
            poli: this.jadwalDokter.kodepoli,
            tgl: this.tanggal
        }

        this.registrasiOnlineService.createSuratKontrol(data)
            .subscribe(data => {
                if(data.response){
                    sessionStorage.setItem('surat_kontrol', JSON.stringify(data.response));
                    this.toKonfirmasi()
                }else{
                    let message: string = data.metaData.message.toString().toLowerCase();
                    if( message.search('sudah diterbitkan rencana kunjungan kontrol di tanggal yang sama') > 0 ){
                        this.registrasiOnlineService.getListSuratKontrol(this.pasien.noaskes, this.tanggal)
                            .subscribe(data => {
                                if( data ){
                                    let obj: any = data.list.find((o: any) => o.tglRencanaKontrol === this.tanggal);
                                    if( obj ){
                                        if( parseInt(obj.kodeDokter) == parseInt(this.jadwalDokter.kodedokter) ){
                                            sessionStorage.setItem('surat_kontrol', JSON.stringify(obj));
                                            this.toKonfirmasi()
                                        }else{
                                            this.registrasiOnlineService.deleteSuratKontrol(obj.noSuratKontrol)
                                                .subscribe(data => {
                                                    if( parseInt(data.metaData.code) == 200 ){
                                                        this.createSuratKontrol()
                                                    }
                                                })
                                        }
                                    }
                                }
                            })
                    }else{
                        if( message.search('nomor sep sudah pernah digunakan') ){
                            this.getDataSuratKontrol(this.pasien.noaskes, this.tanggal, 0, data.metaData.message)
                        }else{
                            this.errorMessageService.message(data.metaData.message);
                        }
                    }
                }
            })
    }

    getSepRujukan() {
        let data: any[] = [];

        this.sep_rujukan.forEach((element: any) => {
            if( element.poliTujSep == this.jadwalDokter.kodepoli ){
                data.push(element)
            }
        });
        if( data.length > 0 ){
            return data[0].noSep
        }else{
            return '';
        }
    }

    getDataSuratKontrol(noaskes: string, tanggal: string, repeat: number, msgError: string) {

        let arrTanggal : any[] = tanggal.split('-');
        let lastMonth : any = parseInt(arrTanggal[1]) - repeat;
        arrTanggal[1] = (lastMonth == 0) ? 12 : lastMonth.toString().padStart(2, '0');
        tanggal = arrTanggal.join('-');

        if( repeat <= 2 ){ // 3x repeat
            this.registrasiOnlineService.getListSuratKontrol(this.pasien.noaskes, tanggal)
                .subscribe(data => {
                    if( data ){
                        data.list.forEach((element: any) => {
                            this.dataSuratKontrol.push(element)
                        });
                        this.getDataSuratKontrol(noaskes, tanggal, repeat+1, msgError);
                    }else{
                        this.getDataSuratKontrol(noaskes, tanggal, repeat+1, msgError);
                    }
                })
        }else{
            let obj: any = this.dataSuratKontrol.find((o: any) => o.noSepAsalKontrol === this.sep_rujukan[0].noSep && o.terbitSEP.toLowerCase() === 'belum');
            if( obj ) {
                this.registrasiOnlineService.deleteSuratKontrol(obj.noSuratKontrol)
                    .subscribe(data => {
                        if( data.metaData.code == '200' ){
                            this.createSuratKontrol();
                        }else{
                            this.errorMessageService.message(data.metaData.message)
                        }
                    })
            }else{
                this.errorMessageService.message(msgError);
            }
        }
    }

    updateSuratKontrol(dataLama: any) {
        let data = {
            noSuratKontrol: dataLama.noSuratKontrol,
            noSEP: this.sep_rujukan[0].noSep,
            kodeDokter: this.jadwalDokter.kodedokter,
            poliKontrol: this.jadwalDokter.kodepoli,
            tglRencanaKontrol: this.tanggal,
        }

        this.registrasiOnlineService.updateSuratKontrol(data)
            .subscribe(res => {
                this.registrasiOnlineService.getSuratKontrol(data.noSuratKontrol)
                    .subscribe(data => {
                        sessionStorage.setItem('surat_kontrol', JSON.stringify(data));
                        this.toKonfirmasi();
                    })
            })
    }

    back() {
        this.router.navigateByUrl('anjungan/bpjs/rujukan');
    }

    next() {
        if( this.jns_kunjungan.name == 'kontrol' ){
            this.createSuratKontrol()
        }else{
            this.toKonfirmasi();
        }
    }

    toKonfirmasi() {
        this.router.navigateByUrl('anjungan/bpjs/konfirmasi');
    }


}
