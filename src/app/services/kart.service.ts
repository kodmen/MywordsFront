import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { kart } from '../models/kart';
import { ListResponseModel } from '../models/requests/listResponseModel';
import { catchError, map } from 'rxjs/operators';
import { YeniKart } from '../models/yeniKart';

@Injectable({
  providedIn: 'root',
})
export class KartService {
  endpoint: string = 'http://localhost:8080/api';

  // endpoint: string = 'http://164.92.229.255:8080/api';
  // headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
  constructor(private http: HttpClient, public router: Router) {}

  getAllKartByDesteId(id: number) {
    let api = `${this.endpoint}/karts-desteId/${id}`;
    return this.http.get<ListResponseModel<kart>>(api, {
      headers: this.headers,
    });
  }

  postNewKart(yeniKart: YeniKart) {
    let api = `${this.endpoint}/karts-deste`;
    return this.http.post(api, yeniKart).pipe(catchError(this.handleError));
  }

  kartGuncelle(kart:kart){
    let api = `${this.endpoint}/karts-deste`;
    return this.http.put(api, kart).pipe(catchError(this.handleError));
  }

  kartSil(id:number){
    let api = `${this.endpoint}/karts/${id}`;
    return this.http.delete(api).pipe(catchError(this.handleError));
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
