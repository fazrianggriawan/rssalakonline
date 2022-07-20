import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { PesertaService } from '../../services/peserta.service';

@Component({
    selector: 'app-pilih-jenis-kunjungan',
    templateUrl: './pilih-jenis-kunjungan.component.html',
    styleUrls: ['./pilih-jenis-kunjungan.component.css'],
    animations: [fadeIn]
})
export class PilihJenisKunjunganComponent implements OnInit {

    public jenisKunjungan: string = '';
    public confirmedPeserta: boolean = false;

    constructor(
        private anjunganService: AnjunganService,
        private pesertaService: PesertaService
    ) { }

    ngOnInit(): void {
        this.anjunganService.getJenisKunjungan().subscribe(data => this.jenisKunjungan = data)
        this.pesertaService.getConfirmed().subscribe(data => this.confirmedPeserta = data)

        this.anjunganService.getOpenPanel()
            .subscribe(data => {
                if (!data) {
                    this.anjunganService.jenisKunjungan.next('');
                }
            })
    }

    public setJenisKunjungan(value: string) {
        this.anjunganService.jenisKunjungan.next(value);
    }

    public back() {
        this.anjunganService.jenisKunjungan.next('');
        this.pesertaService.confirmed.next(false);
    }

}
