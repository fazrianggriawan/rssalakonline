import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { ErrorMessageService } from '../../services/error-message.service';
import { JadwalDokterService } from '../../services/jadwal-dokter.service';
import { RujukanService } from '../../services/rujukan.service';
import { SepService } from '../../services/sep.service';

@Component({
    selector: 'app-jadwal-dokter',
    templateUrl: './jadwal-dokter.component.html',
    styleUrls: ['./jadwal-dokter.component.css'],
    animations: [fadeIn]
})
export class JadwalDokterComponent implements OnInit {

    public dataJadwalDokter: any = [];
    public jadwalDokter: any = {};
    public sep: any = {};
    public jenisKunjungan: string = '';

    constructor(
        private jadwalDokterService: JadwalDokterService,
        private sepService: SepService,
        private rujukanService: RujukanService,
        private anjunganService: AnjunganService,
        private errorMessageService: ErrorMessageService
    ) { }

    ngOnInit(): void {
        this.jadwalDokterService.getDataJadwalDokter().subscribe(data => this.dataJadwalDokter = data);
        this.jadwalDokterService.getJadwalDokter().subscribe(data => this.jadwalDokter = data);
        this.anjunganService.getJenisKunjungan().subscribe(data => this.jenisKunjungan = data);

        this.errorMessageService.getErrorMessage()
            .subscribe(data => {
                if (data) {
                    this.back();
                }
            })

        this.sepService.getSep()
            .subscribe(sep => {
                if (sep.poli) {
                    this.jadwalDokterService.cariJadwalDokter(sep.poli);
                }
            })

        this.rujukanService.getRujukan()
            .subscribe(rujukan => {
                if (rujukan) {
                    this.jadwalDokterService.cariJadwalDokter(rujukan.poliRujukan.nama);
                }
            })

        this.anjunganService.getOpenPanel()
            .subscribe(data => {
                if (!data) {
                    this.jadwalDokterService.dataJadwalDokter.next('');
                    this.jadwalDokterService.jadwalDokter.next('');
                }
            })

    }

    public pilihJadwalDokter(jadwalDokter: any) {
        this.jadwalDokterService.jadwalDokter.next(jadwalDokter);
    }

    public back() {
        this.jadwalDokterService.jadwalDokter.next('');
        this.jadwalDokterService.dataJadwalDokter.next('');
        if (this.jenisKunjungan == 'rujukan')
            this.rujukanService.rujukan.next('');
        if (this.jenisKunjungan == 'kontrol')
            this.sepService.sep.next('');
    }

}
