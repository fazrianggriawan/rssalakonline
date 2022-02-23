import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs';
import { config } from '../config';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class AntrianService {

    cancelAntrian() {
        return this.http.get<any>(config.api_online('delete/cancel_antrian'), { responseType: 'json' }).pipe(catchError(this.errorHandleService.handleIt));
    }

    constructor(
        private errorHandleService: ErrorHandlerService,
        private http: HttpClient
    ) { }
}
