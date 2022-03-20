import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errorStatus = new BehaviorSubject<any>(false);

  getErrorStatus(){
    return this.errorStatus.asObservable();
  }

  constructor() { }
}
