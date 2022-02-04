import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "../config";
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrasiService {

    getDokter(idPoli: any) {
        return this.http.get<any>(config.api_url('vclaim/ref/get/dokter_dpjp/2/'+idPoli));
    }

    constructor(
        private http: HttpClient
    ) { }

}
