import { Component, OnInit } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { AntrianService } from '../../services/antrian.service';
import { JadwalDokterService } from '../../services/jadwal-dokter.service';
import { PesertaService } from '../../services/peserta.service';
import { SepService } from '../../services/sep.service';

@Component({
    selector: 'app-konfirmasi-data',
    templateUrl: './konfirmasi-data.component.html',
    styleUrls: ['./konfirmasi-data.component.css'],
    animations: [fadeIn]
})
export class KonfirmasiDataComponent implements OnInit {

    public peserta: any = {};
    public jenisKunjungan: string = '';
    public sep: any = {};
    public pasien: any = {};
    public jadwalDokter: any = {};
    public today: any = '';

    constructor(
        private pesertaService: PesertaService,
        private anjunganService: AnjunganService,
        private sepService: SepService,
        private jadwalDokterService: JadwalDokterService,
        private antrianService: AntrianService
    ) { }

    ngOnInit(): void {
        this.pesertaService.getPeserta().subscribe(data => { this.peserta = data });
        this.pesertaService.getPasien().subscribe(data => { this.pasien = data });
        this.anjunganService.getJenisKunjungan().subscribe(data => { this.jenisKunjungan = data });
        this.sepService.getSep().subscribe(data => { this.sep = data });
        this.jadwalDokterService.getJadwalDokter().subscribe(data => { this.jadwalDokter = data });
        this.antrianService.getToday().subscribe(data => this.today = data);
    }

    public save() {
        console.log(this.pasien);
        let data = {
            dokter: this.jadwalDokter,
            registrasi: { jnsKunjungan: '2', jnsPasien: 'jkn', rujukan: '', suratKontrol: '' },
            pasien: {
                noKartu: this.peserta.noKartu,
                nik: this.peserta.nik,
                hp: this.pasien.tlp,
                norm: this.pasien.norekmed.substr(-6, 6),
                nama: this.peserta.nama
            },
            selectedPoli: {kode: this.jadwalDokter.kodepoli, nama: this.jadwalDokter.namapoli},
            tanggalKunjungan: this.today,
            isPasienBaru: 0
        }

        this.antrianService.save(data);
    }

    public back() {
        this.jadwalDokterService.jadwalDokter.next('');
    }

}
