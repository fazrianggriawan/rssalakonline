import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';
import { ErrorMessageService } from '../services/error-message.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrasiOnlineService {

    dataPasien = new BehaviorSubject<any>('');
    dataRujukan = new BehaviorSubject<any>('');
    dataJadwalDokter = new BehaviorSubject<any>('');
    dataPoliklinik = new BehaviorSubject<any>('');
    dataHistorySep = new BehaviorSubject<any>('');
    dataSuratKontrol = new BehaviorSubject<any>('');
    jumlahSepRujukan = new BehaviorSubject<any>('');
    pasien = new BehaviorSubject<any>('');
    rujukan = new BehaviorSubject<any>('');
    jadwalDokter = new BehaviorSubject<any>('');
    jenisPembayaran = new BehaviorSubject<any>('');
    suratKontrol = new BehaviorSubject<any>('');
    createSuratKontrolStatus = new BehaviorSubject<boolean>(false);
    dataBooking = new BehaviorSubject<any>('');
    saveStatus = new BehaviorSubject<boolean>(false);
    registrasiOnline = new BehaviorSubject<any>('');
    sep = new BehaviorSubject<any>('');
    checkinStatus = new BehaviorSubject<boolean>(false);
    dataAntrian = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient,
        private errorMessageService: ErrorMessageService
    ) { }

    getPesertaBpjs(key: string) {
        this.http.get<any>(config.api_simrs('online/get/pasienByBpjs?key=' + key))
            .subscribe(data => {
                if (data.code == '200') {
                    if( data.data.nama ){
                        this.dataPasien.next(data.data)
                    }else{
                        this.errorMessageService.message('Data Pasien Tidak Ditemukan');
                    }
                }
            })
    }

    getPasienByRm(key: string) {
        this.http.get<any>(config.api_simrs('online/get/pasienByRm?key=' + key))
            .subscribe(data => {
                if (data.code == '200') {
                    this.dataPasien.next(data.data)
                }
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

    getHistorySep(nomorKartu: string) {        ;
        let end = this.reformatDate(new Date());
        let to = new Date(end.toString());
        to = new Date(to.setDate(to.getDate() - 90));
        let from = this.reformatDate(to);

        this.http.get<any>(config.api_vclaim('history/nomorKartu/' + nomorKartu + '/from/' + from + '/to/' + end))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.dataHistorySep.next(data.response.histori);
                }
            })
    }

    getBookingCode(bookingCode: string) {
        this.http.get<any>(config.api_vclaim('antrian/kodeBooking/' + bookingCode))
            .subscribe(data => {
                if (data.code == 200) {
                    this.registrasiOnline.next(data.data)
                }
            });
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

    getDataSuratKontrol(noKartuBPJS: string) {
        let tanggal = this.reformatDate(new Date());
        this.http.get<any>( config.api_vclaim('suratKontrol/byPeserta/nomorKartu/'+noKartuBPJS+'/bulan/'+tanggal+'/filter/'+1) )
            .subscribe(data => {
                if( data.metaData.code == '200' ){
                    this.dataSuratKontrol.next(data.response.list);
                }
            })
    }

    createSuratKontrol(data: any) {
        this.http.post<any>(config.api_vclaim('suratKontrol/save'), data)
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    let suratKontrol = data.response;
                    sessionStorage.setItem('suratKontrol', JSON.stringify(suratKontrol));
                    this.suratKontrol.next(suratKontrol);
                    this.createSuratKontrolStatus.next(true);
                } else {
                    this.errorMessageService.message(data.metaData.message);
                    this.suratKontrol.next('')
                }
            })
    }

    save(data: any) {
        this.http.post<any>(config.api_vclaim('antrian/save'), data)
            .subscribe(data => {
                if (data.metadata.code == 200) {
                    let booking = data.response;
                    sessionStorage.setItem('booking', JSON.stringify(booking));
                    this.dataBooking.next(booking);
                    this.saveStatus.next(true);
                }else{
                    this.errorMessageService.message(data.metadata.message);
                    this.saveStatus.next(false);
                }
            })
    }

    checkin(data: any){
        this.http.post<any>(config.api_vclaim('antrian/checkin'), data)
            .subscribe(data => {
                if(data.code == 200){
                    this.checkinStatus.next(true);
                }else {
                    this.errorMessageService.message('Gagal untuk checkin');
                    this.checkinStatus.next(false);
                }
            })
    }

    getExpiredRujukan(tanggalRujukan: string) {
        let tujukan = {};
        let tanggal : any = tanggalRujukan.split('-');
        let tglRujukan = new Date(tanggal[0], tanggal[1]-1, tanggal[2]);
        let expiredDate = new Date(tglRujukan.setDate(tglRujukan.getDate()+90));

        let start =  new Date(this.reformatDate(new Date()));
        let end = new Date(this.reformatDate(expiredDate));

        let Time = end.getTime() - start.getTime();
        let Days = Time / (1000 * 3600 * 24); //Diference in Days

        let rujukan = {
            expired: this.reformatDate(expiredDate),
            hariExpired: Days
        }

        return rujukan;
    }

    getAntrianByJadwal(jamPraktek: string, kodePoli: string, tglKunjungan: string){
        this.http.get<any>( config.api_vclaim('antrian/byJadwal/'+jamPraktek+'/'+kodePoli+'/'+tglKunjungan) )
            .subscribe(data => {
                if( data.code == 200 ){
                    this.dataAntrian.next(data.data);
                }
            })
    }

    createSep(data: any) {
        this.http.post<any>(config.api_vclaim('sep/save'), data)
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.sep.next(data.response.sep);
                }else{
                    this.errorMessageService.message(data.metaData.message);
                    this.sep.next('');
                }
            })
    }

    clearAllSession() {
        sessionStorage.clear();
    }

    refreshForm() {
        this.clearAllSession();
        this.dataBooking.next('');
        this.jumlahSepRujukan.next('');
        this.dataBooking.next('');
        this.dataRujukan.next('');
        this.dataJadwalDokter.next('');
        this.sep.next('');
        this.saveStatus.next(false);
        this.dataHistorySep.next('');
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

    trimRekmed(noRekmed: string){
        return noRekmed.substr(-6)
    }
}
