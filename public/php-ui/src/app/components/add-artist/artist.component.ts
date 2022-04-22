import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {map} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ArtistsService } from 'src/app/services/artists.service';
import { Artists } from 'src/app/models/artists';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  roles!: {}[]
  songId!: string
  artist!: Artists
  showHideNotification: boolean = true;

  @Input()
  song!: any

  @Input()
  isEditArtist!: boolean

  constructor(private artistService: ArtistsService,
    private route: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.songId = this.route.snapshot.params["songId"]
    this.roles = [
      { name: "Singer" },
      { name: "Writer" },
      { name: "Composer" }
    ];
  }

  addArtist(artistRegistration: NgForm) {
    let role = [];
    debugger
    for(let artist of artistRegistration.value.role){
      role.push(artist.name)
    }
    this.artist = new Artists(artistRegistration.value.name, role)
    this.artistService.addOne(this.songId, this.artist).subscribe({
      next: response => {
        console.log(response);
        this._toastr.success("Artist added successfully")
      },
      error: err => {
        this._toastr.error("Failed")
        this._router.navigate(["error"]);
      },
      complete: () => {
        this.showHideNotification= false;
        artistRegistration.reset();
      }
    })
  }
}
