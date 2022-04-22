import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "./services/user/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html"
})

export class AppComponent implements OnInit {
    showHome: boolean = this._authService.isLoggedIn

    ngOnInit(): void {
        //this.showHome = this._authService.isLoggedIn
    }

    constructor(private _authService: AuthenticationService) { }

    showHide(value: boolean) {
        this.showHome = value
    }
}