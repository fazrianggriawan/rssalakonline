import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from 'primeng/api';
import { AnjunganService } from "../services/anjungan.service";
import { MessageService, ConfirmationService } from 'primeng/api';
import { ErrorMessageService } from "../shared/services/error-message.service";
import { AntrianService } from "../shared/services/antrian.service";
import { config } from "../config";
import { KeyboardService } from "../shared/services/keyboard.service";

@Component({
    selector: 'app-self-service',
    templateUrl: './self-service.component.html',
    styleUrls: ['./self-service.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class SelfServiceComponent implements OnInit {

    public loading: boolean = false;
    public kodeBooking: string = '';

    constructor(
        private primengConfig: PrimeNGConfig,
        private anjunganservice: AnjunganService,
        private errorMessageService: ErrorMessageService,
        private messageService: MessageService,
        private antrianService: AntrianService,
        private keyboardService: KeyboardService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;

        this.anjunganservice.getLoading().subscribe(data => this.loading = data)
        this.antrianService.getKodeBooking().subscribe(data => this.kodeBooking = data)

        this.errorMessageService.getErrorMessage()
            .subscribe(data => {
                if (data) {
                    this.anjunganservice.loading.next(false);
                    this.messageService.add({ key: 'c', severity: 'error', summary: 'Perhatian', detail: data });
                }
            })

        this.antrianService.getPrintStatus()
            .subscribe(data => {
                if (data) {
                    this.printKodeBooking();
                }
            })

        this.antrianService.getPrintStatusBooking()
            .subscribe(data => {
                if (data) {
                    this.printBooking();
                }
            })
    }

    public printKodeBooking() {
        if (this.kodeBooking) {
            (<HTMLIFrameElement>document.getElementById('printKodeBooking')).src = config.api_online('antrian/print/kodeBooking/' + this.kodeBooking);
        }
    }

    public printBooking() {
        if (this.kodeBooking) {
            (<HTMLIFrameElement>document.getElementById('printKodeBooking')).src = config.api_online('antrian/print/booking/kodeBooking/' + this.kodeBooking);
            this.keyboardService.value.next('');
        }
    }

    public setPanelStatus(type: string, status: boolean) {
        this.anjunganservice.openPanel.next(true);
        if (type == 'online')
            this.anjunganservice.panel.online.next(status);
        if (type == 'bpjs')
            this.anjunganservice.panel.bpjs.next(status);
        if (type == 'tunai')
            this.anjunganservice.panel.tunai.next(status);
        if (type == 'pasienBaru')
            this.anjunganservice.panel.pasienBaru.next(status);
    }

}
