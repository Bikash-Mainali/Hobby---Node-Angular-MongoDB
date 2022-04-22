import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtToken } from 'src/app/models/jwttoken';
import { Login } from 'src/app/models/login';
import { Register } from 'src/app/models/register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  baseUrl: string = environment.REST_API_URL;
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  constructor(private http: HttpClient) { }

  addOne(user: Register): Observable<Register> {
    const url: string = this.baseUrl + "/users";
    return this.http.post<Register>(url, user, { headers: this.headers })
  }

  generateTokenAndLogin(user: Login): Observable<JwtToken> {
    const url: string = this.baseUrl + "/users/login";
    return this.http.post<JwtToken>(url, user)
  }
}
