import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { PesertaService } from '../../services/peserta.service';

@Component({
    selector: 'app-data-peserta',
    templateUrl: './data-peserta.component.html',
    styleUrls: ['./data-peserta.component.css'],
    animations: [fadeIn]
})
export class DataPesertaComponent implements OnInit {

    public peserta: any = {};
    public pasien: any = {};
    public confirmDataPeserta: boolean = false;

    constructor(
        private pesertaService: PesertaService,
        private anjunganService: AnjunganService
    ) { }

    ngOnInit(): void {
        this.pesertaService.getPeserta().subscribe(peserta => this.peserta = peserta);
        this.pesertaService.getPasien().subscribe(pasien => this.pasien = pasien);
        this.pesertaService.getConfirmed().subscribe(status => this.confirmDataPeserta = status)

        this.anjunganService.getOpenPanel()
            .subscribe(data => {
                if (!data) {
                    this.pesertaService.peserta.next('');
                    this.pesertaService.pasien.next('');
                    this.pesertaService.confirmed.next(false);
                }
            })
    }

    public next() {
        this.pesertaService.confirmed.next(true);
    }

    public back() {
        this.pesertaService.peserta.next(null);
        this.pesertaService.confirmed.next(false);
    }

}
