import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ErrorHandlerService {
    httpError = new BehaviorSubject<string>('');

    handleIt(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(error);
            alert(error.message);
            //  console.error(
            //     `Backend returned code ${error.status}, ` +
            //     `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        this.httpError.next('Something bad happened; please try again later.');
        return throwError('Something bad happened; please try again later.');

        // return throwError(error || "Server Error");
    }

    constructor() { }
}