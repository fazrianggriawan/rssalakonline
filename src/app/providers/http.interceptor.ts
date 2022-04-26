import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError, retry } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { ErrorService } from '../services/error.service';
import { ErrorMessageService } from '../shared/services/error-message.service';
import { LoadingService } from '../shared/services/loading.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class HttpProvider implements HttpInterceptor {
    constructor(
        @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
        private errorHandleService: ErrorHandlerService,
        private errorMessageService: ErrorMessageService,
        private loadingService: LoadingService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
        const timeoutValueNumeric = Number(timeoutValue);

        return next.handle(req).pipe(
            timeout(timeoutValueNumeric),
            retry(3),
            catchError((error: HttpErrorResponse) => {
                this.loadingService.status.next(false);
                this.errorMessageService.errorHandle(error.message);
                return EMPTY;
            })
          ) as Observable<HttpEvent<any>>;
    }
}