import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VirtualKeyboardService {

    public value = new BehaviorSubject<string>('');
    public enterAction = new BehaviorSubject<boolean>(false);
    public clear = new BehaviorSubject<boolean>(false);

    constructor() { }

    public getValue() {
        return this.value.asObservable();
    }

    public getEnterAction() {
        return this.enterAction.asObservable();
    }

    public clearAction() {
        this.clear.next(true);
    }

}
