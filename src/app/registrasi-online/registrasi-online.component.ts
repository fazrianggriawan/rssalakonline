import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { RegistrasiOnlineService } from './registrasi-online.service';


@Component({
    selector: 'app-registrasi-online',
    templateUrl: './registrasi-online.component.html',
    styleUrls: ['./registrasi-online.component.css']
})
export class RegistrasiOnlineComponent implements OnInit {

    pasien: any;
    noRm: string = '';
    noKartuBPJS: string = '';
    formRegistrasi: any;
    dataJnsPasien: any;
    dataJnsKunjungan: any;
    dataRujukan: any;
    dataSuratKontrol: any;
    dataPoli: any;
    selectedPoli: any;
    today = new Date();
    statusJadwalDokter: any;
    jadwalDokter: any;
    selectedDokter: any;
    selectedJnsKunjungan: any;
    nomorPasien: string = '';

    items!: MenuItem[];

    constructor(
        private registrasiOnlineService: RegistrasiOnlineService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionPasien();
        this.registrasiOnlineService.dataPasien.subscribe(data => this.pasien = data);
        this.registrasiOnlineService.pasien.subscribe(data => this.pasien = data);
        this.dataJnsKunjungan = [{ id: 1, name: 'Rujukan / Kunjungan Baru' }, { id: 2, name: 'Kontrol Kembali' }]
        this.dataJnsPasien = [{ id: 1, name: 'Tunai' }, { id: 2, name: 'BPJS' }]

        this.items = [
            { label: 'Data Pasien' },
            { label: 'Jenis Kunjungan' },
            { label: 'Rencana Kunjungan' },
            { label: 'Konfirmasi' },
        ];
    }

    getPasien() {
        if (this.nomorPasien.length > 10) {
            this.registrasiOnlineService.getPesertaBpjs(this.nomorPasien);
        } else {
            this.registrasiOnlineService.getPasienByRm(this.nomorPasien);
        }
    }

    next() {
        let data = JSON.stringify(this.pasien);
        sessionStorage.setItem('pasien', data);
        this.router.navigate(['/registrasiOnline/jenis-kunjungan'])
    }

}
