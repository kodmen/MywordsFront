import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/models/currentUser';
import Validation from 'src/app/utils/validation';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
   
  }

  ngOnInit() {
    this.form = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }
  form: FormGroup;
  submitted = false;

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    } else {
      console.log(JSON.stringify(this.form.value, null, 2));
      let userModel = Object.assign({}, this.form.value);
      const login = userModel.username;
      const email = userModel.email;
      const password = userModel.password;
      const langKey = 'en';

      this.authService
        .signUp({ login, email, password, langKey })
        .subscribe((res) => {
          console.log('register gidiyor');
          console.log(res);
            //
            this.form.reset();
            this.router.navigate(['log-in']);
          if (res) {
            //this.signupForm.reset();
            
          }
        });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  // registerUser() {
  //   let userModel = Object.assign({}, this.signupForm.value);
  //   const login = userModel.name;
  //   const email = userModel.email;
  //   const password = userModel.password;
  //   const langKey = 'en';
  //   const checkPass = userModel.checkPassword;

  //   if (password != checkPass) {
  //     this.doNotMatch = true;
  //   } else if (
  //     login == '' ||
  //     email == '' ||
  //     password == '' ||
  //     checkPass == ''
  //   ) {
  //     this.bosVar = true;
  //   } else {
  //     this.authService
  //       .signUp({ login, email, password, langKey })
  //       .subscribe((res) => {
  //         console.log('register gidiyor');
  //         console.log(res);

  //         if (res) {
  //           this.signupForm.reset();
  //           this.router.navigate(['log-in']);
  //         }
  //       });
  //   }
  //   //const authorities = ["ROLE_USER"]
  //   // const activated = true;
  // }

}
