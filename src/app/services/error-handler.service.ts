import { Injectable, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
    providedIn: 'root'
})

export class ErrorHandlerService {

    errorMessage = new BehaviorSubject('');

    getErroMessage(){
        return this.errorMessage.asObservable();
    }

    setErroMessage(status: string){
        this.errorMessage.next(status)
    }

    handleIt(error: HttpErrorResponse): Observable<any> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // console.error(error);
            // this.setErroMessage(error.message);
            // errorService.errorStatus.next(error);
            //  console.error(
            //     `Backend returned code ${error.status}, ` +
            //     `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened, please try again later. ('+error.message+')');

        // return throwError(error || "Server Error");
    }

    constructor(
        public errorService: ErrorService
    ) { }
}