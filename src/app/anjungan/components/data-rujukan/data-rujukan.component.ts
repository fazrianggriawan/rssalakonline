import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { ErrorMessageService } from '../../services/error-message.service';
import { PesertaService } from '../../services/peserta.service';
import { RujukanService } from '../../services/rujukan.service';

@Component({
    selector: 'app-data-rujukan',
    templateUrl: './data-rujukan.component.html',
    styleUrls: ['./data-rujukan.component.css'],
    animations: [fadeIn]
})
export class DataRujukanComponent implements OnInit {

    public dataRujukanFaskes: any = [];
    public dataRujukanRs: any = [];
    public peserta: any = {};
    public rujukan: any = {};
    public jenisKunjungan: string = '';

    constructor(
        private rujukanService: RujukanService,
        private pesertaService: PesertaService,
        private anjunganService: AnjunganService,
        private errorMessageService: ErrorMessageService
    ) { }

    ngOnInit(): void {
        this.rujukanService.getDataRujukanFaskes().subscribe(data => this.dataRujukanFaskes = data);
        this.rujukanService.getDataRujukanRs().subscribe(data => this.dataRujukanRs = data);
        this.rujukanService.getRujukan().subscribe(data => this.rujukan = data)
        this.pesertaService.getPeserta().subscribe(data => this.peserta = data);
        this.anjunganService.getJenisKunjungan().subscribe(data => this.jenisKunjungan = data)

        this.errorMessageService.getErrorMessage()
            .subscribe(data => {
                if (data) {
                    this.back();
                }
            })

        this.anjunganService.getJenisKunjungan()
            .subscribe(jenisKunjungan => {
                if (jenisKunjungan == 'rujukan') {
                    this.rujukanService.cariDataRujukanFaskes(this.peserta.noKartu);
                    this.rujukanService.cariDataRujukanRs(this.peserta.noKartu);
                }
            })

        this.anjunganService.getOpenPanel()
            .subscribe(data => {
                if (!data) {
                    this.rujukanService.dataRujukanFaskes.next('');
                    this.rujukanService.dataRujukanRs.next('');
                    this.rujukanService.rujukan.next('');
                }
            })

    }

    public pilihRujukan(rujukan: any, faskes: string) {
        this.rujukanService.rujukan.next(rujukan)
    }

    public back() {
        this.anjunganService.jenisKunjungan.next('');
    }

}
