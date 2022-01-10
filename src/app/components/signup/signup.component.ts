import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from "@angular/forms";
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/models/currentUser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  //createUser:CurrentUser;
  doNotMatch = false;
  bosVar = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      checkPassword:['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
    })
  }

  ngOnInit() { }

  registerUser() {

    let userModel = Object.assign({},this.signupForm.value);
    const login = userModel.name;
    const email = userModel.email;
    const password = userModel.password;
    const langKey = "en";
    const checkPass = userModel.checkPassword;
 
    if(password != checkPass){
      this.doNotMatch = true;
    }else if(login == "" || email == "" || password == "" || checkPass == "" ){
      this.bosVar = true;
    }
     else{

    this.authService.signUp({login,email,password,langKey}).subscribe((res) => {
      console.log("register gidiyor")
      console.log(res);

      if (res) {
        this.signupForm.reset()
        this.router.navigate(['log-in']);
      }
    })
    }
    //const authorities = ["ROLE_USER"]
   // const activated = true;
    
  }



}