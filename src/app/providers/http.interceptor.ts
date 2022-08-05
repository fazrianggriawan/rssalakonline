import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError, retry } from 'rxjs';
import { timeout, catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../shared/services/loading.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class HttpProvider implements HttpInterceptor {

    private totalRequests = 0;

    constructor(
        @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
        private loadingService: LoadingService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
        const timeoutValueNumeric = Number(timeoutValue);
        this.totalRequests++;

        this.loadingService.status.next(true);

        return next.handle(req).pipe(
            timeout(timeoutValueNumeric),
            catchError((error: HttpErrorResponse) => {
                this.loadingService.status.next(false);
                return EMPTY;
            }),
            finalize(() => {
                this.totalRequests--;
                if( this.totalRequests === 0 ){
                    this.loadingService.status.next(false);
                }

            })
          ) as Observable<HttpEvent<any>>;
    }
}