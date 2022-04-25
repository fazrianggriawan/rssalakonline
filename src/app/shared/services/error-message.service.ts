import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorMessageService {

    public errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(
        // private messageService: MessageService
    ) { }

    public getErrorMessage() {
        return this.errorMessage.asObservable();
    }


    public errorHandle(errorMessage: string) {
        this.errorMessage.next(errorMessage);
        // this.messageService.add({ key: 'c', severity: 'error', summary: 'Perhatian', detail: errorMessage });
    }

}
