import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls:["./songs.component.css"]
})
export class SongsComponent implements OnInit {

  songs: any

  constructor(private songService: SongsService, 
    private _router: Router,
    private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.songService.getAllSongs({ value: false, searchCriteria: {title:'',genre:'', releasedDate:null}})
      .subscribe({
        next: response => {
          this.songs = response;
          //this._toastr.success("Songs fetched successfully")
        },
        error: err => {
          debugger
          this._toastr.error("Failed");
          this._router.navigate(["error"]);

        },
        complete: () => {
          console.log('complete');
        }

      },
      )
  }

  searchSong(searchForm: NgForm) {
    this.songService.getAllSongs({ value: true, searchCriteria: searchForm .value})
      .subscribe({
        next: songResponse => {
          this.songs = songResponse;
          this._toastr.success("Search successful")
        },
        error: err => {
          this._router.navigate(["error"])
          this._toastr.error("Failed")
        },
        complete: () => console.log('complete')

      },
      )
  }
}

