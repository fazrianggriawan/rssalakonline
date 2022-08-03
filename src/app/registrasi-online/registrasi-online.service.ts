import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';
import { LoadingService } from '../shared/services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrasiOnlineService {

    dataPasien = new BehaviorSubject<any>('');
    dataRujukan = new BehaviorSubject<any>('');
    dataJadwalDokter = new BehaviorSubject<any>('');
    dataPoliklinik = new BehaviorSubject<any>('');
    dataHistorySep = new BehaviorSubject<any>('');
    jumlahSepRujukan = new BehaviorSubject<any>('');
    pasien = new BehaviorSubject<any>('');
    rujukan = new BehaviorSubject<any>('');
    jadwalDokter = new BehaviorSubject<any>('');
    jenisPembayaran = new BehaviorSubject<any>('');
    suratKontrol = new BehaviorSubject<any>('');
    createSuratKontrolStatus = new BehaviorSubject<boolean>(false);
    dataBooking = new BehaviorSubject<any>('');
    saveStatus = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService
    ) { }

    getPesertaBpjs(key: string) {
        this.loadingService.status.next(true)
        this.http.get<any>(config.api_simrs('online/get/pasienByBpjs?key=' + key))
            .subscribe(data => {
                if (data.code == '200') {
                    this.dataPasien.next(data.data)
                }
                this.loadingService.status.next(false)
            })
    }

    getPasienByRm(key: string) {
        this.loadingService.status.next(true)
        this.http.get<any>(config.api_simrs('online/get/pasienByRm?key=' + key))
            .subscribe(data => {
                if (data.code == '200') {
                    this.dataPasien.next(data.data)
                }
                this.loadingService.status.next(false)
            })
    }

    getDataRujukan(noKartuBPJS: string) {
        this.http.get<any>(config.api_vclaim('rujukan/faskes/nomorKartu/' + noKartuBPJS))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    let dataRujukan: any = [];
                    data.response.rujukan.forEach((element: any) => {
                        element.asalFaskes = {
                            kode: data.response.asalFaskes,
                            nama: 'fktp',
                            jenisKunjungan: 1
                        }
                        dataRujukan.push(element);
                    });

                    this.dataRujukan.next(dataRujukan)
                }
            })

        this.http.get<any>(config.api_vclaim('rujukan/rs/nomorKartu/' + noKartuBPJS))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    let dataRujukanRs: any = [];
                    data.response.rujukan.forEach((element: any) => {
                        element.asalFaskes = {
                            kode: data.response.asalFaskes,
                            nama: 'antarRs',
                            jenisKunjungan: 4
                        }
                        dataRujukanRs.push(element);
                    });

                    let dataRujukan = this.dataRujukan.value;
                    dataRujukan.push(dataRujukanRs)

                    this.dataRujukan.next(dataRujukan);
                }
            })
    }

    getJumlahSepRujukan(nomorRujukan: string) {
        this.http.get<any>(config.api_vclaim('rujukan/jumlahSep/nomorRujukan/' + nomorRujukan + '/jnsPelayanan/1'))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.jumlahSepRujukan.next(data.response.jumlahSEP);
                }
            })
    }

    getJadwalDokter(kodePoli: string, tglKunjungan: string) {
        this.dataJadwalDokter.next('');
        this.http.get<any>(config.api_vclaim('referensi/jadwalDokter/poli/' + kodePoli + '/tanggal/' + tglKunjungan))
            .subscribe(data => {
                if (data.metadata.code == 200) {
                    this.dataJadwalDokter.next(data.response);
                }
            })
    }

    getHistorySep(nomorKartu: string) {
        this.loadingService.status.next(true);
        let end = this.reformatDate(new Date());
        let to = new Date(end.toString());
        to = new Date(to.setDate(to.getDate() - 90));
        let from = this.reformatDate(to);

        this.http.get<any>(config.api_vclaim('history/nomorKartu/' + nomorKartu + '/from/' + from + '/to/' + end))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.dataHistorySep.next(data.response.histori);
                }
                this.loadingService.status.next(false);
            })
    }

    getSessionPasien() {
        let data: any = sessionStorage.getItem('pasien');
        this.pasien.next(JSON.parse(data));
    }

    getSessionRujukan() {
        let data: any = sessionStorage.getItem('rujukan');
        this.rujukan.next(JSON.parse(data));
    }

    getSessionJadwalDokter() {
        let data: any = sessionStorage.getItem('jadwalDokter');
        this.jadwalDokter.next(JSON.parse(data));
    }

    getSessionJenisPembayaran() {
        let data: any = sessionStorage.getItem('jenisPembayaran');
        this.jenisPembayaran.next(data);
    }

    getSessionBooking() {
        let data: any = sessionStorage.getItem('booking');
        this.dataBooking.next(JSON.parse(data));
    }

    getDataPoliklinik() {
        this.http.get<any>(config.api_vclaim('master/poliklinik'))
            .subscribe(data => {
                this.dataPoliklinik.next(data.data)
            })
    }

    createSuratKontrol(data: any) {
        this.loadingService.status.next(true)
        this.http.post<any>(config.api_vclaim('suratKontrol/save'), data)
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    let suratKontrol = data.response;
                    sessionStorage.setItem('suratKontrol', JSON.stringify(suratKontrol));
                    this.suratKontrol.next(suratKontrol);
                    this.createSuratKontrolStatus.next(true);
                } else {
                    alert(data.metaData.message);
                    this.createSuratKontrolStatus.next(false);
                }
                this.loadingService.status.next(false)
            })
    }

    save(data: any) {
        this.loadingService.status.next(true)
        this.http.post<any>(config.api_vclaim('antrian/save'), data)
            .subscribe(data => {
                if (data.metadata.code == 200) {
                    let booking: any = {
                        kodeBooking: data.response.kodebooking,
                        noAntrian: data.response.nomorantrean,
                        nama: this.pasien.value.nama,
                        tglKunjungan: this.jadwalDokter.value.tglKunjungan,
                        namadokter: this.jadwalDokter.value.namadokter,
                        hari: this.jadwalDokter.value.namahari,
                        jadwal: this.jadwalDokter.value.jadwal,
                        norekmed: this.pasien.value.norekmed,
                        noaskes: this.pasien.value.noaskes,
                        noRujukan: this.rujukan.value.noKunjungan,
                        noSuratKontrol: this.suratKontrol.value.noSuratKontrol
                    }
                    this.clearAllSession();
                    sessionStorage.setItem('booking', JSON.stringify(booking));
                    this.saveStatus.next(true);
                }
                this.loadingService.status.next(false)
            })
    }

    clearAllSession() {
        sessionStorage.clear();
    }

    reformatDate(date: Date) {
        let parsingTanggal = date.toLocaleDateString('id-ID').toString().split('/');
        return parsingTanggal[2].toString() + '-' + parsingTanggal[1].toString().padStart(2, '0') + '-' + parsingTanggal[0].toString().padStart(2, '0')
    }

    dateHuman(date: string) {
        let tanggal = date.split('-');
        let arrBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        let bulan = parseInt(tanggal[1]) - 1
        return tanggal[2] + ' ' + arrBulan[bulan] + ' ' + tanggal[0];
    }
}
