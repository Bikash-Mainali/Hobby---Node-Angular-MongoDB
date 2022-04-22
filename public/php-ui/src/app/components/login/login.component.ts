import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { UserServiceService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() showHideLoginComponent = new EventEmitter<boolean>();
  loginError: boolean = false;
  loginErrorMessage!: string;
  isLoggedIn!: boolean;
  name!: string
  

  constructor(private userService: UserServiceService,
    private _router: Router,
    private _authService: AuthenticationService,
    private _toastr: ToastrService) { }


@Output() onLoginUser = new EventEmitter<boolean>();


  ngOnInit(): void {
  }

  onLogin(loginForm: NgForm) {
    this.userService.generateTokenAndLogin(loginForm.value).subscribe({
      next: (loginResponse) => {
        this._authService.token = loginResponse.token
        this._authService.isLoggedIn = true;
        this.name = this._authService.name;
        this.isLoggedIn = this._authService.isLoggedIn;
        this.onLoginUser.emit(this._authService.isLoggedIn);
        this._toastr.success("Login successful")
        debugger
        if (loginResponse.status === 200) {
          this._router.navigate(["home"])
        } else {
          this.loginError = true;
          this._toastr.error("Login Failed")
          this.loginErrorMessage = 'invalid user name or password!';
        }
      },
      error: (err) => {
        this.loginError = true;
        debugger
        this._toastr.error("Login Failed")
        this.loginErrorMessage = 'invalid user name or password!';
      },
      complete: () => console.log("complete")
    })
  }

  onLogout() {
    this.onLoginUser.emit(false);
    this._authService.deleteToken();
    this._authService.isLoggedIn = false;
    this.isLoggedIn = this._authService.isLoggedIn;
    this._router.navigate(["home"])
  }
}
