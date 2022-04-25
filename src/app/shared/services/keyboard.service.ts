import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    public value: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public enterAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() { }

    public getValue() {
        return this.value.asObservable();
    }

    public getEnterAction() {
        return this.enterAction.asObservable();
    }

}
