import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError, retry } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { ErrorService } from '../services/error.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class HttpProvider implements HttpInterceptor {
    constructor(
        @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
        private errorHandleService: ErrorHandlerService,
        private errorService: ErrorService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
        const timeoutValueNumeric = Number(timeoutValue);

        return next.handle(req).pipe(
            timeout(timeoutValueNumeric),
            retry(3),
            catchError((error: HttpErrorResponse) => {
                alert(JSON.stringify(error));
                console.log(error);
                this.errorService.errorStatus.next(error.message);
                return EMPTY;
            })
          ) as Observable<HttpEvent<any>>;
    }
}