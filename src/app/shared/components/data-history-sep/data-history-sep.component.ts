import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { ErrorMessageService } from '../../services/error-message.service';
import { PesertaService } from '../../services/peserta.service';
import { SepService } from '../../services/sep.service';

@Component({
    selector: 'app-data-history-sep',
    templateUrl: './data-history-sep.component.html',
    styleUrls: ['./data-history-sep.component.css'],
    animations: [fadeIn]
})
export class DataHistorySepComponent implements OnInit {

    public dataHistorySep: any = [];
    public peserta: any = {};
    public sep: any = {};
    public jenisKunjungan: string = '';

    constructor(
        private sepService: SepService,
        private pesertaService: PesertaService,
        private anjunganService: AnjunganService,
        private errorMessageService: ErrorMessageService
    ) { }

    ngOnInit(): void {
        this.sepService.getHistorySep().subscribe(data => this.dataHistorySep = data)
        this.sepService.getSep().subscribe(data => this.sep = data)
        this.pesertaService.getPeserta().subscribe(data => this.peserta = data)
        this.anjunganService.getJenisKunjungan().subscribe(data => this.jenisKunjungan = data)

        this.errorMessageService.getErrorMessage()
            .subscribe(data => {
                if (data) {
                    this.back();
                }
            })


        this.anjunganService.getJenisKunjungan()
            .subscribe(jenisKunjungan => {
                if (jenisKunjungan == 'kontrol') {
                    this.sepService.getDataHistorySep(this.peserta.noKartu)
                }
            })

        this.anjunganService.getOpenPanel()
            .subscribe(data => {
                if (!data) {
                    this.sepService.historySep.next('');
                    this.sepService.sep.next('')
                }

            })

    }

    public pilihSep(sep: any) {
        this.sepService.sep.next(sep);
    }

    public back() {
        this.sepService.historySep.next('');
        this.anjunganService.jenisKunjungan.next('');
    }

}
