import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Artists } from 'src/app/models/artists';
import { ArtistsService } from 'src/app/services/artists.service';

@Component({
  selector: 'app-edit-artist',
  templateUrl: './edit-artist.component.html',
  styleUrls: ['./edit-artist.component.css']
})
export class EditArtistComponent implements OnInit {

  role!: {}[]
  editFormData!: NgForm
  showHideNotification: boolean = true;
  possibleOptions!: []
  selectedRole!: {}[]
  name!: string

  artistId = this.route.snapshot.params["artistId"];
  songId = this.route.snapshot.params["songId"];
  constructor(private route: ActivatedRoute,
    private artistService: ArtistsService,
    private _router: Router,
    private _toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.role = [
      { name: "Singer" },
      { name: "Writer" },
      { name: "Composer" }
    ];
    this.artistService.getOne(this.songId, this.artistId).subscribe({
      next: artistResponse => {
        debugger
        this._toastr.success("Artist fetched succesfully")
        this.name = artistResponse.name
        let roleArray = [];
        for (let role of artistResponse.role) {
          roleArray.push({ name: role })
        }
        this.selectedRole = roleArray
        console.log(artistResponse)
        this.possibleOptions = artistResponse.role

      },
      error: err => {
        this._toastr.error("Failed")
        this._router.navigate(["error"]);
      },
      complete: () => {
      }
    })

  }

  onUpdate(editFormData: NgForm) {
    let roleNames = [];
    console.log("...")
    debugger
    console.log(editFormData.value)
    for (let r of editFormData.value.role) {
      roleNames.push(r.name);
    }
    console.log(roleNames)
    let postData = new Artists(editFormData.value.name, roleNames)
    this.artistService.updateOne(postData, this.songId, this.artistId)
      .subscribe({
        next: artistResponse => {
          this._toastr.success("Artist updated succesfully")
        },
        error: err => {
          this._router.navigate(["error"])
          this._toastr.error("Failed")
        },
        complete: () => {
          this.showHideNotification = false;
          this._router.navigate([`songs`]);

        }
      })
  }

  onDelete(songId: string, artistId: string): void {
    this.artistService.deleteOne(songId, artistId).subscribe({
      next: artistResponse => {
        this._toastr.success("Artist Deleted Successfully")
      },
      error: err => {
        this._toastr.error("Failed")
        this._router.navigate(["error"]);
      },
      complete: () => {
        // this._router.navigate(["artist"]);
        this.editFormData.reset();

      }
    })
  }
}
