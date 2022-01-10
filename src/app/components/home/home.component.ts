import { Component, OnInit } from '@angular/core';
import {DesteService} from "src/app/services/deste.service"
import {Deste} from "src/app/models/deste"
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public desteService: DesteService) { }
  desteler: Deste[] =[];
  dataLoaded = false;
  desteEkleForm = false;

  ngOnInit(): void {
    this.getDesteler();
  }

  getDesteler(){
   this.desteService.getUserProfile().subscribe(res => {
        this.desteler = res.data;

        

        var kartlar = res.data.map(o => o.kartlars)
        const usersCollection = [].concat(...kartlar)
        console.log(usersCollection)

        console.log("local deste yaz")
        console.log(this.desteler);
        this.dataLoaded = true;
    });
  }

  getbgColor(renk:string){
    console.log("getbgColor calisti");
    let color = renk.substr(1,renk.length);
    let colorInt = parseInt(color)+333;
    console.log("renk clor "+ colorInt);
    let result: string = `background: linear-gradient(45deg,${renk},#${colorInt})`;
 
    //const result:string = 'background: linear-gradient(45deg,${renk},#73b4ff)'
    console.log(result);
    return result;
  }

  desteEkle(){
    this.desteEkleForm = true;
  }

}
