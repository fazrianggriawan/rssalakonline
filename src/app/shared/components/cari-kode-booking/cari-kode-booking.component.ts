import { Component, OnInit } from '@angular/core';
import { AntrianService } from '../../services/antrian.service';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
    selector: 'app-cari-kode-booking',
    templateUrl: './cari-kode-booking.component.html',
    styleUrls: ['./cari-kode-booking.component.css']
})
export class CariKodeBookingComponent implements OnInit {

    public kodeBooking: string = '';

    constructor(
        private antrianService: AntrianService,
        private keyboardService: KeyboardService
    ) { }

    ngOnInit(): void {
        this.keyboardService.getValue().subscribe(data => this.kodeBooking = data);
    }

    public onInputChange(event: any) {

    }

    public onBlur() {

    }

    public listenKey(event: any) {
        if (event.keyCode == 13) {
            console.log('cari kode booking');
        }
    }

    public back() {
        console.log('back');
    }

}
