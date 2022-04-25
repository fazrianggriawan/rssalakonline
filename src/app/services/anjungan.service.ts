import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class AnjunganService {

    panelStatus = new BehaviorSubject<any>(false);
    panel = {
        bpjs: new BehaviorSubject<any>(false),
        tunai: new BehaviorSubject<any>(false),
        pasienBaru: new BehaviorSubject<any>(false),
        online: new BehaviorSubject<any>(false)
    }

    public nomorPeserta: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public jenisKunjungan: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public buildKeyboard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public openPanel: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient
    ) { }

    public getNomorPeserta() {
        return this.nomorPeserta.asObservable();
    }

    public getJenisKunjungan() {
        return this.jenisKunjungan.asObservable();
    }

    public getBuildKeyboard() {
        return this.buildKeyboard.asObservable();
    }

    public getLoading() {
        return this.loading.asObservable();
    }

    public getPanelStatus() {
        return this.panelStatus.asObservable();
    }

    public getOpenPanel() {
        return this.openPanel.asObservable();
    }

    public getPanelStatusOnline() {
        return this.panel.online.asObservable();
    }

    public getPanelStatusBpjs() {
        return this.panel.bpjs.asObservable();
    }

    public getPanelStatusTunai() {
        return this.panel.tunai.asObservable();
    }

    public getPanelStatusPasienbaru() {
        return this.panel.pasienBaru.asObservable();
    }

    public getBookingCode(bookingCode: string) {
        return this.http.get<any>(config.api('anjungan/get/booking_code?booking_code=' + bookingCode), { responseType: 'json' });
    }

}
