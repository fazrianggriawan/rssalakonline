import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { config } from '../config';
import { ErrorMessageService } from '../services/error-message.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrasiOnlineService {

    dataPasien = new BehaviorSubject<any>('');
    dataRujukanFaskes = new BehaviorSubject<any>('');
    dataRujukanRs = new BehaviorSubject<any>('');
    dataJadwalDokter = new BehaviorSubject<any>('');
    dataPoliklinik = new BehaviorSubject<any>('');
    dataHistorySep = new BehaviorSubject<any>('');
    dataSuratKontrol = new BehaviorSubject<any>('');
    jumlahSepRujukan = new BehaviorSubject<any>('');
    pasien = new BehaviorSubject<any>('');
    peserta = new BehaviorSubject<any>('');
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
    registrasiAndroid = new BehaviorSubject<any>('');
    sesi = new BehaviorSubject<any>('');

    constructor(
        private http: HttpClient,
        private errorMessageService: ErrorMessageService
    ) { }

    getPasien(key: String): Observable<any>{
        let subject = new Subject;

        this.http.get<any>(config.api('online/get_pasien/'+key))
            .subscribe(data => {
                if( data.code == 200 ){
                    subject.next(data.data)
                }else{
                    this.errorMessageService.message('Data Pasien Tidak Ditemukan');
                }
            })

        return subject;

    }

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
                if (data.data.nama) {
                    this.dataPasien.next(data.data)
                }else{
                    this.errorMessageService.message('Data Pasien Tidak Ditemukan');
                }
            })
    }

    getDataBookingAndroid(kodeBooking: string){
        this.http.get<any>(config.api_simrs('online/get/bookingAndroid?key=' + kodeBooking))
            .subscribe(data => {
                if (data.data.noreg) {
                    this.registrasiAndroid.next(data.data)
                }else{
                    this.errorMessageService.message('Data Registrasi Online Tidak Ditemukan');
                }
            })
    }

    getPeserta(noKartuBpjs: string): Observable<any> {
        let subject = new Subject;
        this.http.get<any>(config.api_vclaim('peserta/nomorKartu/' + noKartuBpjs))
            .subscribe(data => {
                if(data){
                    if (data.metaData.code == '200') {
                        this.peserta.next(data.response.peserta);
                        subject.next(data.response.peserta)
                    }else{
                        this.errorMessageService.message(data.metaData.message);
                    }
                }else{
                    this.errorMessageService.message('Data Peserta BPJS Tidak Ditemukan');
                }
            })
        return subject;
    }

    getListRujukan(noKartuBPJS: any, rujukanDari: string): Observable<any> {
        let subject = new Subject;

        this.http.get<any>(config.api_vclaim('rujukan/'+rujukanDari+'/nomorKartu/' + noKartuBPJS))
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

                    subject.next(dataRujukan);
                }else{
                    subject.next(false);
                }
            })

        return subject;
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

                    this.dataRujukanFaskes.next(dataRujukan)
                }
            })

        this.http.get<any>(config.api_vclaim('rujukan/rs/nomorKartu/' + noKartuBPJS))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    let dataRujukan: any = [];
                    data.response.rujukan.forEach((element: any) => {
                        element.asalFaskes = {
                            kode: data.response.asalFaskes,
                            nama: 'antarRs',
                            jenisKunjungan: 4
                        }
                        dataRujukan.push(element);
                    });

                    console.log(dataRujukan);

                    this.dataRujukanRs.next(dataRujukan)

                }
            })
    }

    getJumlahSepByRujukan(nomorRujukan: string, asalRujukan: any): Observable<any>{
        let subject = new Subject;
            this.http.get<any>(config.api_vclaim('rujukan/jumlahSep/nomorRujukan/' + nomorRujukan + '/jnsPelayanan/'+asalRujukan))
                .subscribe(data => {
                    if (data.metaData.code == '200') {
                        subject.next(data.response.jumlahSEP);
                    }else{
                        subject.next(false);
                    }
                })
        return subject;
    }

    getJumlahSepRujukan(nomorRujukan: string) {
        this.http.get<any>(config.api_vclaim('rujukan/jumlahSep/nomorRujukan/' + nomorRujukan + '/jnsPelayanan/1'))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.jumlahSepRujukan.next(data.response.jumlahSEP);
                }
            })
    }

    getJadwalDokter(kodePoli: string, tglKunjungan: string): Observable<any> {
        let subject = new Subject;

        this.dataJadwalDokter.next('');
        this.http.get<any>(config.api_vclaim('referensi/jadwalDokter/poli/' + kodePoli + '/tanggal/' + tglKunjungan))
            .subscribe(data => {
                if (data.metadata.code == 200) {
                    subject.next(data.response);
                    this.dataJadwalDokter.next(data.response);
                }else{
                    this.errorMessageService.message('Tidak ada jadwal dokter pada tanggal '+this.dateHuman(tglKunjungan));
                }
            })

        return subject;
    }

    getSep(noSep: string): Observable<any>{
        let subject = new Subject;

        this.http.get<any>(config.api_vclaim('sep/nomorSep/'+noSep))
            .subscribe(data => {
                if( data.metaData.code == '200' ) {
                    subject.next(data.response)
                }else{
                    subject.next(false)
                }
            })

        return subject
    }

    getHistorySep(nomorKartu: string): Observable<any> {
        let subject = new Subject;

        let end = this.reformatDate(new Date());
        let to = new Date(end.toString());
        to = new Date(to.setDate(to.getDate() - 90));
        let from = this.reformatDate(to);

        this.http.get<any>(config.api_vclaim('history/nomorKartu/' + nomorKartu + '/from/' + from + '/to/' + end))
            .subscribe(data => {
                if (data.metaData.code == '200') {
                    this.dataHistorySep.next(data.response.histori);
                    subject.next(data.response.histori);
                }
            })

        return subject;
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

    getSessionPeserta() {
        let data: any = sessionStorage.getItem('peserta');
        this.peserta.next(JSON.parse(data));
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

    getSessionSesi() {
        let data: any = sessionStorage.getItem('sesi');
        this.sesi.next(JSON.parse(data));
    }

    getSessionBooking() {
        let data: any = sessionStorage.getItem('booking');
        this.dataBooking.next(JSON.parse(data));
    }

    getDataPoliklinik(): Observable<any> {
        let subject = new Subject;

        this.http.get<any>(config.api_vclaim('master/poliklinik'))
            .subscribe(data => {
                this.dataPoliklinik.next(data.data)
                subject.next(data.data)
            })

        return subject;
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

    getListSuratKontrol(noKartuBPJS: string, tanggal: string): Observable<any> {
        let subject = new Subject;

        this.http.get<any>( config.api_vclaim('suratKontrol/byPeserta/nomorKartu/'+noKartuBPJS+'/bulan/'+tanggal+'/filter/'+2) )
            .subscribe(data => {
                if( data.metaData.code == '200' ){
                    subject.next(data.response);
                }else{
                    subject.next(data.response);
                }
            })
        return subject;
    }

    createSuratKontrol(data: any): Observable<any>{
        let subject = new Subject;
        this.http.post<any>(config.api_vclaim('suratKontrol/save'), data)
            .subscribe(data => {
                subject.next(data);
            })
        return subject;
    }

    saveBooking(data: any): Observable<any>{
        let subject = new Subject;
        this.http.post<any>(config.api_vclaim('antrian/save'), data)
            .subscribe(data => {
                if (data.code == 200) {
                    subject.next(data.data);
                }else{
                    this.errorMessageService.message(data.message);
                    subject.next(false);
                }
            })
        return subject;
    }

    save(data: any) {
        this.http.post<any>(config.api_vclaim('antrian/save'), data)
            .subscribe(data => {
                if (data.metadata.code == 200) {
                    this.dataBooking.next(data.response);
                    this.saveStatus.next(true);
                }else{
                    this.errorMessageService.message(data.metadata.message);
                    this.saveStatus.next(false);
                }
            })
    }

    saveRegistrasi(data: any): Observable<any>{
        let subject = new Subject;

        this.http.post<any>(config.api_simrslama('ambilantriannonjkn.php'), data)
            .subscribe(data => {
                subject.next(data)
            })

        return subject
    }

    checkin(data: any){
        this.http.post<any>(config.api_vclaim('antrian/checkin'), data)
            .subscribe(data => {
                if(data.code == 200){
                    this.checkinStatus.next(true);
                }else {
                    // this.errorMessageService.message('Gagal untuk checkin');
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

    createSep(data: any): Observable<any>{
        let subject = new Subject;

        this.http.post<any>(config.api_vclaim('sep/save'), data)
            .subscribe(res => {
                let data : any = res.json_response;
                if (parseInt(data.metaData.code) == 200) {
                    subject.next(data.response.sep);
                }else{
                    this.errorMessageService.message(data.metaData.message);
                }
            })

        return subject;
    }

    clearAllSession() {
        // sessionStorage.clear();
    }

    refreshForm() {
        this.clearAllSession();
        this.dataBooking.next('');
        this.jumlahSepRujukan.next('');
        this.dataBooking.next('');
        this.dataRujukanFaskes.next('');
        this.dataRujukanRs.next('');
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

    saveToSimrs(data: any) : Observable<any> {
        let subject = new Subject;

        this.http.post<any>(config.api('online/save_to_simrs'), data)
            .subscribe(res => {
                if( res.code == 200 ){
                    subject.next(res.data);
                }else{
                    let position = res.message.toUpperCase().search("SUDAH TERDAFTAR");
                    if( position > 0 ){
                        let html = '<hr/><div>Kode Booking</div><h4 class="text-black">'+res.data.data.token+'</h4><a href="./#/registrasi/view-booking/'+res.data.data.token+'" target="_blank" class="btn btn-primary">Lihat Data Booking <i class="bi bi-box-arrow-up-right"></i></a>';
                        this.errorMessageService.message(res.message + html);
                    }else{
                        this.errorMessageService.message(res.message);
                    }

                    subject.next(false);

                }
            })

        return subject;
    }

    saveAfterSep(data: any): Observable<any> {
        let subject = new Subject;

        this.http.post<any>(config.api('online/save_after_sep'), data)
            .subscribe(data => {
                if( data.code == 200 ){
                    subject.next(data);
                }else{
                    subject.next(false);
                }
            })

        return subject;
    }

    getSuratKontrol(noSuratKontrol: any): Observable<any> {
        let subject = new Subject;

        this.http.get<any>(config.api_vclaim('suratKontrol/get/'+noSuratKontrol))
            .subscribe(data => {
                if( data.metaData.code == 200 ){
                    subject.next(data.response);
                }else{
                    subject.next(false);
                }
            })

        return subject;
    }

    getSuratKontrolBySep(noSep: string): Observable<any> {
        let subject = new Subject;

        this.http.get<any>(config.api_vclaim('suratKontrol/bySep/'+noSep))
            .subscribe(data => {
                subject.next(data);
                // if( data.metaData.code == 200 ){
                //     subject.next(data.response);
                // }else{
                //     subject.next(false);
                // }
            })

        return subject;
    }

    getDataBooking(kode_booking: string): Observable<any> {
        let subject = new Subject;

        this.http.get<any>(config.api('online/get_booking/'+kode_booking))
            .subscribe(data => {
                subject.next(data.data);
            })

        return subject;
    }

    updateSuratKontrol(data: any): Observable<any> {
        let subject = new Subject;

        this.http.post<any>(config.api_vclaim('suratKontrol/update'), data)
            .subscribe(data => {
                subject.next(data);
            })

        return subject;
    }

    validasiRegistrasi(id_pasien: any): Observable<any> {
        let subject = new Subject;

        this.http.get<any>(config.api('online/validasi_registrasi/'+id_pasien))
            .subscribe(data => {
                if( data.code == 200){
                    subject.next(data.data);
                }else{
                    this.errorMessageService.message(data.message);
                }
            })

        return subject;
    }

    batalkanKunjungan(data: any): Observable<any> {
        let subject = new Subject;

        this.http.post<any>(config.api('online/batal_kunjungan'), data)
            .subscribe(data => {
                if( data.code == 200){
                    subject.next(data.data);
                    this.errorMessageService.message(data.message);
                }else{
                    this.errorMessageService.message(data.message);
                }
            })

        return subject;
    }

    updateSepRegistrasi(data: any): Observable<any> {
        let subject = new Subject;

        this.http.post<any>(config.api_vclaim('antrian/update-sep-registrasi'), data)
            .subscribe(data => {
                subject.next(data);
            });

        return subject;
    }

    deleteSuratKontrol(noSuratKontrol: any): Observable<any> {
        let subject = new Subject;
        this.http.get<any>(config.api_vclaim('suratKontrol/delete/noSuratKontrol/'+noSuratKontrol))
            .subscribe(data => {
                subject.next(data);
            });
        return subject;
    }

    getFingerPrint(noaskes: string, tanggal: string): Observable<any>{
        let subject = new Subject;

        this.http.get(config.api_vclaim('antrian/fingerprint/'+noaskes+'/'+tanggal))
            .subscribe(data => {
                subject.next(data)
            })

        return subject;
    }

}
