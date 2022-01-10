import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { AuthService } from './../../shared/auth.service';
import { AuthService } from 'src/app/shared/auth.service';
import { CurrentUser } from 'src/app/models/currentUser'
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  User: CurrentUser;

  constructor(
    public authService: AuthService,
    private actRoute: ActivatedRoute
  ) {
    //let id = this.actRoute.snapshot.paramMap.get('id');
    this.authService.getUserProfile().subscribe(res => {
      this.User = res;
    })
  }

  ngOnInit() { }
}