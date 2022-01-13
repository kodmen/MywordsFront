import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  hata = false;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      username: ['',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ],],
      password: ['',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40),
      ],]
    })
  }

  ngOnInit() { }

  get f(): { [key: string]: AbstractControl } {
    return this.signinForm.controls;
  }

  loginUser() {
    this.submitted = true;
    if (this.signinForm.invalid) {
      return;
    } 

    this.authService.signIn(this.signinForm.value).subscribe(res=>{
        localStorage.setItem('access_token', res.id_token)
        this.router.navigate(['home']);
    },err=>{
      this.hata = true;
    })
    
  }

  goToSignIn(){
    this.router.navigate(['sign-up']);
  }
}