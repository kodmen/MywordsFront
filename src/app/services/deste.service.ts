import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ListResponseModel } from 'src/app/models/requests/listResponseModel';
import { Deste } from '../models/deste';

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
