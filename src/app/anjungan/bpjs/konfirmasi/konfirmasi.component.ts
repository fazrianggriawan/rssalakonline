import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config';
import { RegistrasiOnlineService } from 'src/app/registrasi-online/registrasi-online.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';

@Component({
    selector: 'app-konfirmasi',
    templateUrl: './konfirmasi.component.html',
    styleUrls: ['./konfirmasi.component.css']
})
export class KonfirmasiComponent implements OnInit, OnDestroy {

    pasien: any;
    peserta: any;
    rujukan: any;
    jadwalDokter: any;
    jenisKunjungan: any;
    lastSep: any;
    suratKontrol: any;
    sep: any;
    dataBooking: any;
    success: boolean  = false;

    subSep : any;
    subHistorySep : any;

    constructor(
        private router: Router,
        public registrasiOnlineService: RegistrasiOnlineService,
        private errorMessageService: ErrorMessageService
    ) { }

    ngOnInit(): void {
        this.getSessionData();
        this.subHistorySep = this.registrasiOnlineService.dataHistorySep.subscribe(data => this.handleHistorySep(data))
        this.registrasiOnlineService.dataSuratKontrol.subscribe(data => this.handleDataSuratKontrol(data))
        this.registrasiOnlineService.suratKontrol.subscribe(data => this.handleCreateSuratKontrol(data))
        this.registrasiOnlineService.dataBooking.subscribe(data => this.handleDataBooking(data))
        this.registrasiOnlineService.getDataSuratKontrol(this.pasien.noaskes);

        this.subSep = this.registrasiOnlineService.sep.subscribe(data => {
            if(data){
                this.sep = data;
                this.updateSepRegistrasi(this.dataBooking.kodebooking, this.sep.noSep);
            }else{
                this.sep = '';
            }
        })
    }

    updateSepRegistrasi(kodebooking: any, nosep: any) {
        let data = {
            kodebooking: kodebooking,
            nosep:  nosep
        }

        this.registrasiOnlineService.updateSepRegistrasi(data)
            .subscribe(data => {
                this.success = true;
                this.printAnjungan();
            })
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subSep.unsubscribe();
        this.subHistorySep.unsubscribe();
    }

    handleDataBooking(data: any){
        if( data ){
            this.success = true;
            this.dataBooking = data;
            this.printAnjungan();
            // Checkin data antrian
            this.registrasiOnlineService.checkin(this.dataBooking);
        }
    }

    getSessionData() {
        let pasien: any = sessionStorage.getItem('pasien');
        let peserta: any = sessionStorage.getItem('peserta');
        let rujukan: any = sessionStorage.getItem('rujukan');
        let jadwalDokter: any = sessionStorage.getItem('jadwalDokter');

        this.pasien = JSON.parse(pasien);
        this.peserta = JSON.parse(peserta);
        this.rujukan = JSON.parse(rujukan);
        this.jadwalDokter = JSON.parse(jadwalDokter);

        this.registrasiOnlineService.getHistorySep(this.pasien.noaskes);

    }

    handleDataSuratKontrol(data: any) {
        if(data) {
            data.forEach((item:any) => {
                let tanggal = this.registrasiOnlineService.reformatDate(new Date());
                if( tanggal == item.tglRencanaKontrol ){
                    this.suratKontrol = item;
                }else{
                    this.suratKontrol = '';
                }
            });
        }
    }


    handleSep(data: any) {
        if (data) {
            this.sep = data;
            this.save();
        }
    }

    handleHistorySep(data: any) {
        this.lastSep = '';
        if (data) {
            let sepRujukan: any = [];
            data.forEach((element: any) => {
                if (element.noRujukan == this.rujukan.noKunjungan) {
                    sepRujukan.push(element);
                }
                this.checkSepToday(element);
            });
            if (sepRujukan.length > 0) {
                this.lastSep = sepRujukan[0];
            }
        }
    }

    checkSepToday(data: any) {
        let today = this.registrasiOnlineService.reformatDate(new Date());
        if( data.tglSep == today ){
            this.sep = data;
        }
    }

    handleCreateSuratKontrol(data: any) {
        if (data) {
            this.suratKontrol = data;
            this.jenisKunjungan = { kode: 3, nama: 'kontrolKembali' };
            this.createSep();
        }
    }

    back() {
        sessionStorage.removeItem('jadwalDokter');
        this.router.navigateByUrl('anjungan/bpjs/jadwalDokter');
    }

    daftar() {
        this.save();
    }

    getAllSuratKontrol() {
        this.registrasiOnlineService.getDataSuratKontrol(this.pasien.noaskes);
    }

    createSuratKontrol() {
        let data = {
            noSep: this.lastSep.noSep,
            dokter: this.jadwalDokter.kodedokter,
            poli: this.jadwalDokter.kodepoli,
            tgl: this.jadwalDokter.tglKunjungan
        }

        if( !this.suratKontrol ){
            this.registrasiOnlineService.createSuratKontrol(data);
        }else{
            this.createSep();
        }
    }

    createSep() {
        let data = {
            noKartu: this.rujukan.peserta.noKartu,
            tglSep: this.registrasiOnlineService.reformatDate(new Date()),
            jnsPelayanan: '2',
            hakKelas: this.rujukan.peserta.hakKelas,
            naikKelas: '',
            naikKelasPembiayaan: '',
            naikKelasPenanggungJawab: '',
            norm: this.rujukan.peserta.mr.noMR,
            rujukan: { asalFaskes: this.rujukan.asalFaskes.kode, rujukan: this.rujukan },
            catatan: '-',
            diagnosa: this.rujukan.diagnosa,
            poliklinik: { kode: this.jadwalDokter.kodepoli, nama: this.jadwalDokter.namapoli },
            poliklinikEks: '0',
            cob: '0',
            katarak: '0',
            isLakaLantas: '0',
            lakaNoLp: '',
            lakaTglKejadian: '',
            lakaKeterangan: '',
            lakaSuplesi: '',
            lakaNoSuplesi: '',
            lakaPropinsi: '',
            lakaKabupaten: '',
            lakaKecamatan: '',
            tujuanKunj: '',
            flagProcedure: '',
            kdPenunjang: '',
            assessmentPel: '',
            skdp: { noSuratKontrol: '', kodeDokter: '' },
            dokter: { kode: this.jadwalDokter.kodedokter, nama: this.jadwalDokter.namadokter },
            tlp: this.rujukan.peserta.mr.noTelepon
        }

        if( parseInt(this.rujukan.jumlahSep) == 0 ){
            // Rujukan Baru
            data.tujuanKunj = '0'
        }else{
            if (this.rujukan.poliRujukan.kode == this.jadwalDokter.kodepoli) {
                // Tujuan Kontrol
                data.tujuanKunj = '2'
                data.assessmentPel = '5'
                data.skdp.noSuratKontrol = this.suratKontrol.noSuratKontrol;
                data.skdp.kodeDokter = this.jadwalDokter.kodedokter;
            }else{
                // Rujukan Internal
                data.tujuanKunj = '0'
                data.assessmentPel = '1'
            }
        }

        this.registrasiOnlineService.createSep(data);

    }

    save() {

        if (this.rujukan.poliRujukan.kode == this.jadwalDokter.kodepoli) {
            // Tujuan Kontrol
            this.jenisKunjungan =  {kode: 3 }
        } else {
            if( parseInt(this.rujukan.jumlahSep) > 0 ){
                // Rujukan Internal
                this.jenisKunjungan =  {kode: 2 }
            }else{
                // Rujukan Baru
                this.jenisKunjungan = {kode: this.rujukan.asalFaskes.jenisKunjungan};
            }
        }

        let data = {
            pasien: this.pasien,
            rujukan: this.rujukan,
            suratKontrol: this.suratKontrol,
            jadwalDokter: this.jadwalDokter,
            jenisPembayaran: 'bpjs',
            jenisKunjungan: this.jenisKunjungan
        }

        let dataRegistrasi = {
            nomorkartu : data.rujukan.peserta.noKartu,
            nik : data.rujukan.peserta.nik,
            nohp : data.rujukan.peserta.mr.noTelepon,
            cara_bayar : 'BPJS',
            status_pendaftaran : 'LAMA',
            jenispasien : 'JKN',
            kodepoli : data.jadwalDokter.kodepoli,
            norm : data.pasien.norekmed,
            tanggalperiksa : this.registrasiOnlineService.reformatDate(new Date()),
            kodedokter : data.jadwalDokter.kodedokter.toString(),
            namadokter : data.jadwalDokter.namadokter,
            jampraktek : data.jadwalDokter.jadwal,
            jeniskunjungan : data.jenisKunjungan.kode,
            nomorreferensi : data.rujukan.noKunjungan
        }

        this.registrasiOnlineService.saveRegistrasi(dataRegistrasi)
            .subscribe(data => {
                if( data.metadata.code == 200 ){

                    this.dataBooking = data.response;

                    if (parseInt(this.rujukan.jumlahSep) == 0) {
                        // Rujukan Baru
                        this.jenisKunjungan = { kode: this.rujukan.asalFaskes.jenisKunjungan, nama: this.rujukan.asalFaskes.nama };
                        this.createSep();
                    } else {
                        if (this.rujukan.poliRujukan.kode == this.jadwalDokter.kodepoli) {
                            // Rencana Kontrol
                            this.createSuratKontrol();
                        }else{
                            // Rujukan Internal
                            this.jenisKunjungan = { kode: 2, nama: 'rujukanInternal' };
                            this.createSep();
                        }
                    }
                }else{
                    this.errorMessageService.message(data.metadata.message);
                }
            })

    }

    done(){
        // sessionStorage.clear();
        this.router.navigateByUrl('anjungan');
    }

    printAnjungan() {
        if( this.dataBooking.kodebooking && this.sep.noSep ){
            (<HTMLIFrameElement>document.getElementById('iframePrintSepBpjs')).src = config.api_vclaim('sep/print/anjungan/' + this.sep.noSep + '/' + this.dataBooking.kodebooking);
            // (<HTMLIFrameElement>document.getElementById('iframePrintBookingBpjs')).src = config.api_vclaim('sep/print/booking/' + this.dataBooking.kodebooking);
        }
    }

}
