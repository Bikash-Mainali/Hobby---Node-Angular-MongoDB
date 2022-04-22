import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Songs } from 'src/app/models/songs';
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

registrationForm!:FormGroup

  constructor(private songsService: SongsService,
     private _router: Router,
     private _toastr: ToastrService) {
    this.registrationForm = new FormGroup({
      title: new FormControl(''),
      genre: new FormControl(''),
      releasedDate: new FormControl(''),

    })
  }

  ngOnInit(): void {
  }

  addForm(){
    this.songsService.addOne(this.registrationForm.value).subscribe({
      next: songResponse => {
        this._toastr.success("Song added successfully");
      },
      error: err =>{
        this._toastr.error("Failed");
        this._router.navigate(["error"])

      },
      complete: () =>{
        this._router.navigate(["songs"])
      }
    })
  }
}
