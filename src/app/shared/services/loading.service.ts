import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() { }

    public getStatus() {
        return this.status.asObservable();
    }
}
