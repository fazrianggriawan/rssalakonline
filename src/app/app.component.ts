import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api'
import { RegistrasiService } from './services/registrasi.service';
import { NgxHowlerService } from "ngx-howler";
import { timeout } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'rssalakonline';
    panelRegistrasi : boolean = false;
    jadwalDokter: any = [];
    selectedDokter: any;
    noKartuBPJS : string = '';
    dataPasien : any = {};
    dataDokter : any[] = [];
    dataRujukan : any[] = [];
    dataSuratKontrol : any[] = [];
    selectedPoli : any = {};
    statusJadwalDokter : boolean = false;
    loading : boolean = false;
    today : Date = new Date();

    dataPoli : any[] = [
        {kode: "ANA", nama: "Anak", prefix: "A1", selected: false},
        {kode: "ANT", nama: "Anastesi", prefix: "A2", selected: false},
        {kode: "BED", nama: "Bedah", prefix: "A3", selected: false},
        {kode: "BDM", nama: "Bedah Mulut", prefix: "A4", selected: false},
        {kode: "BDP", nama: "Bedah Plastik", prefix: "A5", selected: false},
        {kode: "006", nama: "Geriatri", prefix: "A6", selected: false},
        {kode: "INT", nama: "Internis / Penyakit Dalam", prefix: "A7", selected: false},
        {kode: "JAN", nama: "Jantung & Pembuluh Darah", prefix: "A8", selected: false},
        {kode: "JIW", nama: "Jiwa", prefix: "A9", selected: false},
        {kode: "KLT", nama: "Kulit Kelamin", prefix: "B1", selected: false},
        {kode: "MAT", nama: "Mata", prefix: "B2", selected: false},
        {kode: "OBG", nama: "Obgyn", prefix: "B3", selected: false},
        {kode: "ORT", nama: "Orthopedi", prefix: "B4", selected: false},
        {kode: "PAR", nama: "Paru", prefix: "B5", selected: false},
        {kode: "IRM", nama: "Rehabilitasi Medik", prefix: "B6", selected: false},
        {kode: "SAR", nama: "Saraf", prefix: "B7", selected: false},
        {kode: "THT", nama: "THT", prefix: "B8", selected: false},
        {kode: "UMU", nama: "Umum", prefix: "B9", selected: false},
        {kode: "URO", nama: "Urologi", prefix: "C1", selected: false},
    ];

    dataJnsKunjungan : any[] = [
        {kode: 1, nama: 'Kunjungan Pertama Kali'},
        {kode: 3, nama: 'Kontrol'},
    ]

    dataJnsPasien : any[] = [
        {kode: 'jkn', nama: 'BPJS'},
        {kode: 'nonjkn', nama: 'NON BPJS / TUNAI'},
    ]

    formRegistrasi = this.fb.group({
        poli: [null, Validators.required],
        tanggal: [null, Validators.required],
        jnsKunjungan: [null],
        rujukan: [null],
        jnsPasien: [null],
        suratKontrol: [null]
    })

    clearJadwalDokter(){
        this.jadwalDokter = [];
        this.statusJadwalDokter = false;
    }

    clearCalendar(){
        this.formRegistrasi.patchValue({ tanggal: null })
    }

    clearPoli(){
        this.selectedPoli = null;
        this.formRegistrasi.patchValue({ poli: null })
    }

    clearDataRujukan(){
        this.dataRujukan = [];
        this.formRegistrasi.patchValue({rujukan: null});
    }

    clearDataKontrol(){
        this.dataSuratKontrol = [];
        this.formRegistrasi.patchValue({suratKontrol: null});
    }

    changeJnsKunjungan(){
        this.clearPoli();
        this.clearJadwalDokter();
        if( this.formRegistrasi.value.jnsKunjungan == 3 ){
            this.getDataKontrol();
        }else{
            this.getDataRujukan();
        }
    }

    getDataKontrol(){
        this.clearDataKontrol();
        this.clearDataRujukan();
        this.loading = true;
        this.registrasiService.getDataKontrol().subscribe(data => {
            if( data.metaData.code == '200' ){
                let newData : any = [];
                data.response.list.forEach((element: any) => {
                    if( element.noKartu == this.dataPasien.noKartu ){
                        newData.push(element);
                    }
                });
                this.dataSuratKontrol = newData;
            }
            this.loading = false;
        })
    }

    getDataRujukan(){
        this.clearDataRujukan();
        this.clearDataKontrol();
        this.loading = true;
        this.registrasiService.getDataRujukan(this.dataPasien.noKartu).subscribe(data => {
            if( data.metaData.code == '200' ){
                this.dataRujukan = data.response.rujukan;
            }
            this.loading = false;
        })
    }

    changeSuratKontrol(){
        if( this.formRegistrasi.value.suratKontrol ){
            let index = this.dataSuratKontrol.findIndex(x => x.noSuratKontrol === this.formRegistrasi.value.suratKontrol);
            this.setPoli(this.dataSuratKontrol[index].poliTujuan);
        }else{
            this.clearPoli();
        }
        this.getJadwalDokter();
    }

    setPoli(value:any){
        this.selectedPoli = value;
        this.formRegistrasi.patchValue({poli: value});
    }

    changeRujukan(){
        if( this.formRegistrasi.value.rujukan ){
            let index = this.dataRujukan.findIndex(x => x.noKunjungan === this.formRegistrasi.value.rujukan);
            this.setPoli(this.dataRujukan[index].poliRujukan.kode);
        }else{
            this.clearPoli();
        }
        this.getJadwalDokter();
    }

    getJadwalDokter(){
        this.statusJadwalDokter = false;
        if( this.formRegistrasi.valid ){
            this.loading = true;
            let data = {
                tgl : this.formRegistrasi.value.tanggal.toLocaleDateString(),
                poli : this.formRegistrasi.value.poli
            }
            this.registrasiService.getJadwalDokter(data).subscribe(data => {
                if( data.metadata.code == 200 ){
                    this.jadwalDokter = data.response;
                    this.statusJadwalDokter = true;
                }else{
                    this.jadwalDokter = [];
                    this.statusJadwalDokter = true;
                }
                this.loading = false;
            })
        }
    }

    next(){
        let idxPoli = this.dataPoli.findIndex(x => x.kode === this.formRegistrasi.value.poli);
        let data = {
            registrasi : this.formRegistrasi.value,
            pasien : this.dataPasien,
            dokter : this.selectedDokter,
            isPasienBaru : 0,
            tanggalKunjungan : this.formRegistrasi.value.tanggal.toLocaleDateString(),
            selectedPoli : this.dataPoli[idxPoli]
        }

        this.registrasiService.saveRegistrasi(data).subscribe(data => {
            console.log(data);
        })
    }

    titleCaseWord(word: string) {
        let a = word.toLowerCase()
                .replace('dr.', 'dr. ')
                .replace(',', ', ')
                .replace('  ', ' ');
        return a;
    }

    getPasienBPJS(){
        this.dataPasien = {};
        this.loading = true;
        this.registrasiService.getPesertaBPJS(this.noKartuBPJS).subscribe(data => {
            if( data.metaData.code == 200 ){
                this.dataPasien = data.response.peserta;
                let umur = this.dataPasien.umur.umurSekarang.split(',');
                this.dataPasien.umurSekarang = umur[0];
                this.getDataRujukan();
            }
            this.loading = false;
        })
    }

    dateHuman(a:string){
        let thn = a.substring(0, 4);
        let bln = a.substring(5, 7);
        let hr = a.substring(8, 10);
        return hr+'-'+bln+'-'+thn;
    }

    hidePanelRegistrasi(){
        this.resetFormRegistrasi();
    }

    resetFormRegistrasi(){
        this.formRegistrasi.reset();
        this.dataPasien = {};
    }

    constructor(
        private config : PrimeNGConfig,
        private fb : FormBuilder,
        private registrasiService: RegistrasiService,
        private howl: NgxHowlerService
    ){}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // this.translateService.use('id');
        this.config.setTranslation({
            dayNames: ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],
            dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            dayNamesMin: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            monthNames: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember"]
        })
    }

}

