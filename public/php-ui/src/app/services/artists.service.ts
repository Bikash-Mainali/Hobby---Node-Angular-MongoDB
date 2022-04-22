import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Artists } from '../models/artists';
import { AuthenticationService } from './user/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  baseUrl: string = environment.REST_API_URL;
  headers!: HttpHeaders

  constructor(private http: HttpClient, private _authService: AuthenticationService) {}


  addOne(songId: string, artist: Artists): Observable<Artists> {
    const url: string = this.baseUrl + "/songs/" + songId + "/artists";
    this.headers = this._authService.headers
    return this.http.post<Artists>(url, artist, { headers: this.headers });
  }

  getOne(songId: string, artistId: string): Observable<any> {
    const url: string = this.baseUrl + "/songs/" + songId + "/artists/" + artistId;
    this.headers = this._authService.headers
    return this.http.get<any>(url, { headers: this.headers });

  }

  updateOne(artist: Artists, songId: string, artistId: string): Observable<Artists> {
    const url: string = this.baseUrl + "/songs/" + songId + "/artists/" + artistId;
    this.headers = this._authService.headers
    return this.http.patch<Artists>(url, artist, { headers: this.headers })
  }

  deleteOne(songId: string, artistId: string): Observable<Artists> {
    const url: string = this.baseUrl + "/songs/" + songId + "/artists/" + artistId;
    this.headers = this._authService.headers
    return this.http.delete<Artists>(url, { headers: this.headers })
  }

}
