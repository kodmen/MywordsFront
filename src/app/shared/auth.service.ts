import { Injectable } from '@angular/core';
import { User } from './user';
import { JhipsterUser } from './jhipsteruser';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { CurrentUser } from '../models/currentUser';
import { RegisterUser } from '../models/registerUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'http://localhost:8080/api';

  // endpoint: string = 'http://164.92.229.255:8080/api';
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  currentUser: CurrentUser;

  constructor(private http: HttpClient, public router: Router) {}

  // Sign-up
  signUp(user: RegisterUser): Observable<{}> {
    // user.authorities = ["ROLE_USER"];
    // user.activated = true;
    let api = `${this.endpoint}/register`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in
  signIn(user: JhipsterUser) {
    return this.http.post<any>(`${this.endpoint}/authenticate`, user);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  getUserProfile(): Observable<any> {
    let api = `${this.endpoint}/account`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
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
