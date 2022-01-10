import { Component, OnInit } from '@angular/core';
import { DesteService } from 'src/app/services/deste.service';
import { Deste } from 'src/app/models/deste';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  desteler: Deste[] = [];
  dataLoaded = false;
  desteEkleForm = false;
  desteYeni: FormGroup;

  constructor(public desteService: DesteService, public fb: FormBuilder) {
    this.desteYeni = this.fb.group({
      name: [''],
      renk: [''],
    });
  }

  ngOnInit(): void {
    this.getDesteler();
  }

  getDesteler() {
    this.desteService.getUserProfile().subscribe((res) => {
      this.desteler = res.data;

      var kartlar = res.data.map((o) => o.kartlars);
      const usersCollection = [].concat(...kartlar);
      console.log(usersCollection);

      console.log('local deste yaz');
      console.log(this.desteler);
      this.dataLoaded = true;
    });
  }

  getbgColor(renk: string) {
    console.log("gelen reki "+renk);
    let renkClass = '';
    switch (renk) {
      case 'mavi':
        renkClass = 'bg-c-blue';
        break;
      case 'sarı':
        renkClass = 'bg-c-yellow';
        break;
      case 'yeşil':
        renkClass = 'bg-c-green';
        break;
      case 'pembe':
        renkClass = 'bg-c-pink';
        break;

      default:
        renkClass = 'bg-c-blue';
        break;
    }

    return `card ${renkClass} order-card`;
  }

  desteEkleFormAc() {
    this.desteEkleForm = true;
  }

  desteEkleFormKapat() {
    this.desteEkleForm = false;
  }

  desteEkle() {
    this.desteService.postNewDeste(this.desteYeni.value).subscribe((res) => {
      console.log('deste gonderildi ');
      console.log(res);
      this.desteEkleForm = false;
      window.location.reload();
    });
  }
}
