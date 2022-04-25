import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from 'primeng/api';
import { AnjunganService } from "../services/anjungan.service";
import { MessageService, ConfirmationService } from 'primeng/api';
import { ErrorService } from "../services/error.service";
import { ErrorMessageService } from "../shared/services/error-message.service";

@Component({
    selector: 'app-self-service',
    templateUrl: './self-service.component.html',
    styleUrls: ['./self-service.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class SelfServiceComponent implements OnInit {

    public loading: boolean = false;

    constructor(
        private primengConfig: PrimeNGConfig,
        private anjunganservice: AnjunganService,
        private errorMessageService: ErrorMessageService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;

        this.anjunganservice.getLoading().subscribe(data => this.loading = data)

        this.errorMessageService.getErrorMessage()
            .subscribe(data => {
                if (data) {
                    this.anjunganservice.loading.next(false);
                    this.messageService.add({ key: 'c', severity: 'error', summary: 'Perhatian', detail: data });
                }
            })
    }

    setPanelStatus(type: string, status: boolean) {
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
