import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './services/error-handler.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class Timeout implements HttpInterceptor {
    constructor(
        @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
        private errorHandleService: ErrorHandlerService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
        const timeoutValueNumeric = Number(timeoutValue);

        return next.handle(req).pipe(timeout(timeoutValueNumeric), catchError(this.errorHandleService.handleIt));
    }
}