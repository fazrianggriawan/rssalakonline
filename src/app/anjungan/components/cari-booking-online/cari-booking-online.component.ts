import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnjunganService } from 'src/app/services/anjungan.service';
import { fadeIn } from '../../animations';
import { AntrianService } from '../../services/antrian.service';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
    selector: 'app-cari-booking-online',
    templateUrl: './cari-booking-online.component.html',
    styleUrls: ['./cari-booking-online.component.css'],
    animations: [fadeIn]
})
export class CariBookingOnlineComponent implements OnInit {

    @ViewChild('search', { static: false }) searchElement!: ElementRef;

    public kodeBooking: string = '';
    public dataBooking: any = {};

    constructor(
        private antrianService: AntrianService,
        private keyboardService: KeyboardService,
        private anjunganService: AnjunganService
    ) { }

    ngOnInit(): void {
        this.keyboardService.getValue().subscribe(data => this.kodeBooking = data)
        this.antrianService.getDataBooking().subscribe(data => this.dataBooking = data)
        this.anjunganService.getPanelStatusOnline()
            .subscribe(data => {
                if (data)
                    this.onBlur();
            });

        this.keyboardService.getEnterAction()
            .subscribe(data => {
                if( data )
                    this.antrianService.cariBooking(this.kodeBooking);
            })
    }

    public listenKey(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.antrianService.cariBooking(this.kodeBooking);
        }
    }

    public onBlur() {
        setTimeout(() => {
            this.searchElement.nativeElement.focus();
        }, 200);
    }

}
