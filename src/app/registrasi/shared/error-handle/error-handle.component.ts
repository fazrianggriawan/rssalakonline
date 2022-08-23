import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorMessageService } from 'src/app/services/error-message.service';

@Component({
    selector: 'app-error-handle',
    templateUrl: './error-handle.component.html',
    styleUrls: ['./error-handle.component.css'],
    providers: [MessageService]
})
export class ErrorHandleComponent implements OnInit {

    constructor(
        private messageService: MessageService,
        private errorMessageService: ErrorMessageService
    ) { }

    ngOnInit(): void {
        this.errorMessageService.errorMessage.subscribe(message => {
            if (message) {
                this.messageService.clear();
                this.messageService.add({ severity: 'warn', life: 5000, detail: message });
            }
        })
    }

}
