import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _jwtService: JwtHelperService) { }

  #isLoggedIn: boolean = false;
  #name!: string
  #password!: string

  get isLoggedIn() {
    return this.#isLoggedIn;

  }

  set isLoggedIn(isLoggedIn) {
    this.#isLoggedIn = isLoggedIn;
  }

  get token() {
    return localStorage.getItem(environment.TOKEN_KEY) as string;

  }
  set token(token) {
    localStorage.removeItem(environment.TOKEN_KEY);
    localStorage.setItem(environment.TOKEN_KEY, token);
    this.#isLoggedIn = true;
  }

  get name() {
    let user: string = "";
    if (this.token) {
      user = this._jwtService.decodeToken(this.token).name as string
    }
    const tokenString: string = localStorage.getItem(environment.TOKEN_KEY) as string;
    this.#name = this._jwtService.decodeToken(tokenString).name;
    return this.#name;
  }

  get password(){
    const tokenString: string = localStorage.getItem(environment.TOKEN_KEY) as string;
    this.#password = this._jwtService.decodeToken(tokenString).password;
    return this.#password;
  }

  deleteToken() {
    localStorage.clear();
    localStorage.removeItem(environment.TOKEN_KEY);
    this.isLoggedIn = false;
  }

  get headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
  }

}
