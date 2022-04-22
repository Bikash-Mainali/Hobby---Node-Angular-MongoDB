import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Songs } from 'src/app/models/songs';
import { SongsService } from 'src/app/services/songs.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  song!: any;
  showAddArtistForm: boolean = true;
  showEditSong: boolean = false;
  showArtistList: boolean = false;
  isEditArtist: boolean = false;
  isLoggedIn!: boolean
  constructor(private route: ActivatedRoute,
    private songService: SongsService,
    private _router: Router,
    private _toastr: ToastrService,
    private _authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn
    const songId = this.route.snapshot.params["songId"];
    this.songService.getOne(songId).subscribe({
      next: songResponse => {
        console.log(songResponse)
        this.song = songResponse
        this._toastr.success("Song fetched successfully")
      },
      error: err => {
        this._toastr.error("Failed")
        this._router.navigate(["error"]);
      },
      complete: () => {
      }
    })
  }

  onDelete(song: any): void {
    this.songService.deleteOne(song._id).subscribe({
      next: songResponse => {
        this._toastr.success("Song deleted successfully")
      },
      error: err => {
        this._router.navigate(["error"]);
        this._toastr.error("Failed")
      },
      complete: () => {
        this._router.navigate(["songs"]);
      }
    })
  }


  onAddArtist(song: Songs) {
    this._router.navigate(["artist"])
    this.showAddArtistForm = true;
  }

  onEditSong(song: Songs) {
    this.showEditSong = true;
    this.showArtistList = false;

  }
  onEditArtist(song: any) {
    console.log(song.artists)
    this.showAddArtistForm = true;
    this.showArtistList = true;
    this.isEditArtist = true;
  }
}
