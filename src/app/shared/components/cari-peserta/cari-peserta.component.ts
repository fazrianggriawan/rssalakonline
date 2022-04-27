import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { KeyboardService } from '../../services/keyboard.service';
import { PesertaService } from '../../services/peserta.service';

@Component({
    selector: 'app-cari-peserta',
    templateUrl: './cari-peserta.component.html',
    styleUrls: ['./cari-peserta.component.css'],
    animations: [fadeIn]
})
export class CariPesertaComponent implements OnInit {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    public nomorKartu: string = '';
    public jenisPasien: string = '';
    public peserta: any = {};

    constructor(
        private anjunganService: AnjunganService,
        private pesertaService: PesertaService,
        private keyboardService: KeyboardService
    ) { }

    ngOnInit(): void {
        this.anjunganService.getJenisKunjungan().subscribe(jenisPasien => this.jenisPasien = jenisPasien);
        this.keyboardService.getValue().subscribe(data => this.nomorKartu = data);
        this.keyboardService.getEnterAction().subscribe(data => this.getPeserta());
        this.anjunganService.getOpenPanel()
            .subscribe(data => {
                if (!data) {
                    this.anjunganService.nomorPeserta.next('');
                }
            })

        this.pesertaService.getPeserta()
            .subscribe(peserta => {
                this.peserta = peserta;
            });
    }

    public setJenisKunjungan(value: string) {
        this.anjunganService.jenisKunjungan.next(value);
    }

    public back() {
        this.anjunganService.panel.bpjs.next(false);
    }

    public listenKey(e: any) {
        if (e.keyCode == 13)
            this.getPeserta();
    }

    public getPeserta() {
        if (this.nomorKartu) {
            this.pesertaService.cariPeserta(this.nomorKartu);
            this.pesertaService.cariPasien(this.nomorKartu);
        }
    }

    public onBlur() {
        this.searchElement.nativeElement.focus();
    }

}
