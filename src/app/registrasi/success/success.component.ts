import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { RegistrasiOnlineService } from '../registrasi-online.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

    @ViewChild('screen', { static: true }) screen: any;

    booking: any;
    imageCapture: any;

    constructor(
        public registrasiOnlineService: RegistrasiOnlineService,
        private captureService: NgxCaptureService
    ) { }

    ngOnInit(): void {
        this.registrasiOnlineService.getSessionBooking();
        this.registrasiOnlineService.dataBooking.subscribe(data => this.booking = data)
        this.captureImage();
    }

    captureImage(){
        setTimeout(() => {
            this.captureService.getImage(this.screen.nativeElement, true)
            .pipe(
                tap(img => {
                    this.imageCapture = img;
                })
            ).subscribe();
        }, 100);

    }

}
