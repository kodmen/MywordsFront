import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ListResponseModel } from 'src/app/models/requests/listResponseModel';
import { Deste } from '../models/deste';
import {yeniDeste} from '../models/yeniDeste'

@Injectable({
  providedIn: 'root'
})
export class DesteService {
  endpoint: string = 'http://localhost:8080/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor( private http: HttpClient, public router: Router) { }

  // User profile
  getUserProfile(): Observable<ListResponseModel<Deste>> {
    let api = `${this.endpoint}/deste-user`;
    return this.http.get<ListResponseModel<Deste>>(api, { headers: this.headers });
    
  }

  postNewDeste(deste:yeniDeste){
    let api = `${this.endpoint}/destes-user`;
    return this.http.post(api, deste)
    .pipe(
      catchError(this.handleError)
    )
  }

  desteGuncelle(d:Deste){
    let api = `${this.endpoint}/destes-user`;
    return this.http.put(api, d).pipe(catchError(this.handleError));
  }

  desteSil(id:number){
    let api = `${this.endpoint}/destes/${id}`;
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
