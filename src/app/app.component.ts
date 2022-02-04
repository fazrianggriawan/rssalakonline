import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api'
import { RegistrasiService } from './services/registrasi.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'rssalakonline';
    panelRegistrasi : boolean = false;
    dataPoli : any[] = [
        {kode: "ANA", nama: "Anak"},
        {kode: "ANT", nama: "Anastesi"},
        {kode: "BED", nama: "Bedah"},
        {kode: "BDM", nama: "Bedah Mulut"},
        {kode: "BDP", nama: "Bedah Plastik"},
        {kode: "006", nama: "Geriatri"},
        {kode: "INT", nama: "Internis / Penyakit Dalam"},
        {kode: "JAN", nama: "Jantung & Pembuluh Darah"},
        {kode: "JIW", nama: "Jiwa"},
        {kode: "KLT", nama: "Kulit Kelamin"},
        {kode: "MAT", nama: "Mata"},
        {kode: "OBG", nama: "Obgyn"},
        {kode: "ORT", nama: "Orthopedi"},
        {kode: "PAR", nama: "Paru"},
        {kode: "IRM", nama: "Rehabilitasi Medik"},
        {kode: "SAR", nama: "Saraf"},
        {kode: "THT", nama: "THT"},
        {kode: "UMU", nama: "Umum"},
        {kode: "URO", nama: "Urologi"}
    ];
    dataDokter : any[] = [];
    poliId : string = 'OBG';

    formRegistrasi = this.fb.group({
        poli: [null, Validators.required],
        dokter: [null, Validators.required],
    })

    selectPoli() {
        this.getDokter(this.formRegistrasi.value.poli);
    }

    getDokter(idPoli:any){
        this.registrasiService.getDokter(idPoli).subscribe(data => {
            this.dataDokter = data.response.list;
            console.log(data)
        });
    }

    titleCaseWord(word: string) {
        let a = word.toLowerCase()
                .replace('dr.', 'dr. ')
                .replace(',', ', ')
                .replace('  ', ' ');
        return a;
    }

    constructor(
        private config : PrimeNGConfig,
        private fb : FormBuilder,
        private registrasiService: RegistrasiService
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
