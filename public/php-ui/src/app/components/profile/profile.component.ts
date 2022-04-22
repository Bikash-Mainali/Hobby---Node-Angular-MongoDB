import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  isLoggedIn!:boolean
  name!: string
  password!: string
  constructor(private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn
    this.name = this._authService.name
    this.password = this._authService.password
  }

  onUpdatePassword(){}

}
