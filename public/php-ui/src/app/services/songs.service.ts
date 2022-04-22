import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchFilter } from '../models/search.filter';
import { Songs } from '../models/songs';
import { AuthenticationService } from './user/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SongsService implements OnInit{

  baseUrl: string = environment.REST_API_URL;
  headers!: HttpHeaders

  constructor(private http: HttpClient, private _authService: AuthenticationService) {}

  ngOnInit(): void {
  }


  getAllSongs(searchFilter:SearchFilter): Observable<Songs> {
    let url!:string
    console.log("getting all song: service")
    if(!searchFilter.value){
    url = this.baseUrl + "/songs";
    }else{
      //console.log(searchFilter.searchCriteria.releasedDate)
      url = this.baseUrl + `/songs?title=${searchFilter.searchCriteria.title}&genre=${searchFilter.searchCriteria.genre}&releasedDate=${searchFilter.searchCriteria.releasedDate}`;
    }
    console.log(this.headers)
    return this.http.get<Songs>(url)
  }


  getOne(songId: string): Observable<Songs> {
    const url: string = this.baseUrl + "/songs/" + songId;
    this.headers = this._authService.headers
    return this.http.get<Songs>(url, { headers: this.headers });
  }

  deleteOne(songId: string): Observable<Songs> {
    const url: string = this.baseUrl + "/songs/" + songId;
    this.headers = this._authService.headers
    return this.http.delete<Songs>(url, { headers: this.headers })
  }

  addOne(song: Songs):Observable<Songs> {
    const url: string = this.baseUrl + "/songs";
    this.headers = this._authService.headers
    return this.http.post<Songs>(url, song, { headers: this.headers })
  }

  updateOne(song: Songs, songId:string): Observable<Songs> {
    const url: string = this.baseUrl + "/songs/"+ songId;
    this.headers = this._authService.headers
    return this.http.patch<Songs>(url, song, { headers: this.headers })
  }

}
