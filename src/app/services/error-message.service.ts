import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorMessageService {

    errorMessage = new BehaviorSubject<string>('');

    constructor() { }

    message(errorMessage: string) {
        this.errorMessage.next(errorMessage);
    }

}
