import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    status = new BehaviorSubject<boolean>(false);

    constructor() { }

    public getStatus() {
        return this.status.asObservable();
    }
}
