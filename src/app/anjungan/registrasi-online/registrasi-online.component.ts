import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { config } from 'src/app/config';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AnjunganService } from '../services/anjungan.service';
import { KeyboardService } from '../services/keyboard.service';

@Component({
  selector: 'app-registrasi-online',
  templateUrl: './registrasi-online.component.html',
  styleUrls: ['./registrasi-online.component.css']
})
export class RegistrasiOnlineComponent implements OnInit {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    kodeBooking: string = '';
    registrasi : any = '';
    pasien : any = '';
    rujukan : any = '';
    jadwalDokter : any = '';

    constructor(
        private keyboardService: KeyboardService,
        public anjunganService: AnjunganService
    ) {}

    ngOnInit(): void {
        this.keyboardService.getValue().subscribe(data => this.kodeBooking = data)
        this.anjunganService.registrasiOnline.subscribe(data => this.handleDataBooking(data))

        this.keyboardService.getEnterAction()
            .subscribe(data => {
                if( data )
                    this.anjunganService.getBookingCode(this.kodeBooking);
            })
        this.onBlur();
    }

    handleDataBooking(data: any) {
        this.reset();
        if( data ){
            this.registrasi = data;
            this.rujukan = JSON.parse(data.rujukan);
            this.jadwalDokter = JSON.parse(data.jadwalDokter);
            this.pasien = JSON.parse(data.pasien);
        }
    }

    reset(){
        this.kodeBooking = '';
        this.registrasi = '';
        this.rujukan = '';
        this.pasien = '';
        this.onBlur();
    }


    listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.anjunganService.getBookingCode(this.kodeBooking);
        }
    }

    onBlur() {
        setTimeout(() => {
            this.searchElement.nativeElement.focus();
        }, 200);
    }

    checkIn() {
        console.log(config.api_vclaim('sep/print/anjungan/1003R0020722V001426'));
        (<HTMLIFrameElement>document.getElementById('iframePrintSep')).src = config.api_vclaim('sep/print/anjungan/1003R0020722V001426');
    }


}
