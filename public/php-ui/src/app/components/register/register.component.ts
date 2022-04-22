import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserServiceService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hasSuccess:boolean = false;
  hasError:boolean = false;
  message:string = ""

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
  }

  onRegister(registerForm: NgForm){
    console.log(registerForm)
    this.userService.addOne(registerForm.value).subscribe({
      next: (response) => {
        this.hasSuccess = true;
        this.hasError = false;
        this.message = "Success"
        registerForm.resetForm();
      },
      error: (err) => {
        this.hasError = true;
        this.hasSuccess = false;
        this.message = "Fail"
      },
      complete: () => console.log("complete")
    })
  }

}
