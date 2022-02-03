import { Component, OnInit, Input } from '@angular/core';
import { DesteService } from 'src/app/services/deste.service';
import { Deste } from 'src/app/models/deste';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SilmeSorgu } from '../kart/kart.component';
import { KartService } from 'src/app/services/kart.service';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">kart Ekleme!</h4>
    </div>
    <div class="modal-body">
      <form
        class="form-signin"
        [formGroup]="yeniKart"
        (ngSubmit)="kartEkle()"
      >

        <div class="form-group m-3">
          <label>on yuz</label>
          <input
            type="username"
            class="form-control"
            formControlName="onYuz"
            placeholder="bişeyler yazın"
            required
          />
        </div>
        <div class="form-group m-3">
          <label>arka yuz</label>
          <input
            type="username"
            class="form-control"
            formControlName="arkaYuz"
            placeholder="bişeyler yazın"
            required
          />
        </div>
        <button type="submit" class="btn btn-block btn-primary mx-3">
          kart eklensin
        </button>
      </form>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-dark"
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>
  `,
})
export class KartEkleModel implements OnInit {
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private kartService: KartService
  ) {
    this.yeniKart = this.fb.group({
      onYuz: [''],
      arkaYuz: [''],
    });
  }
  
  yeniKart: FormGroup;
  @Input() id:number;


  ngOnInit(): void {
  }

  kartEkle() {
    let kart = Object.assign({}, this.yeniKart.value);
    let onYuz = kart.onYuz;
    let arkaYuz = kart.arkaYuz;
    let desteId = this.id;

   
    this.kartService.postNewKart({ onYuz, arkaYuz, desteId }).subscribe((res) => {
      console.log('kart guncellendi');
      window.location.reload();
    });
  }


}


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h2 class="modal-title">Deste guncelleme!</h2>
    </div>

    <div class="modal-body">
      <form
        class="form-signin"
        [formGroup]="guncelDeste"
        (ngSubmit)="desteGuncelle()"
      >
        <div class="form-group m-3">
          <label>name </label>
          <input
            type="username"
            class="form-control"
            formControlName="name"
            placeholder="bişeyler yazın"
            required
          />
        </div>
        <div class="form-group m-3">
          <label>renk</label>
          <input
            type="username"
            class="form-control"
            formControlName="renk"
            placeholder="bişeyler yazın"
            required
          />
        </div>
        <button type="submit" class="btn btn-block btn-primary mx-3">
          guncelle
        </button>
      </form>
    </div>
    <div class="modal-footer d-flex justify-content-start ">
      <button type="submit" class="btn btn-block btn-success mx-3 w-25 " (click)="kartEkle(oldDeste.id); activeModal.close('Close click')" 
      >
        kart ekle
      </button>

      <button
        type="submit"
        class="btn btn-block btn-warning mx-3 w-25 "
        routerLink="/deste/{{ oldDeste.id }}"
        (click)="activeModal.close('Close click')"
      >
        kart düzenle
      </button>

      <button
        type="submit"
        class="btn btn-block btn-danger mx-3 w-25 "
        (click)="sil(); activeModal.close('Close click')"
      >
        deste sil
      </button>

      <button
        type="button"
        class="btn btn-outline-dark w-25 mx-3 "
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>
  `,
})
export class DesteGuncelle implements OnInit {
  @Input() name;
  @Input() oldDeste;

  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public desteService: DesteService,
    private modalService: NgbModal
  ) {
    this.guncelDeste = this.fb.group({
      renk: [''],
      name: [''],
    });
  }
  guncelDeste: FormGroup;
  

  ngOnInit(): void {
    this.updateDeste();
  }

  goToDeste(){
    //this.router.naigate(['/component-one']);
   // this.Router.navigate(['/', 'page-name']);
  }

  sil() {
    const modalRef = this.modalService.open(SilmeSorgu);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.id = this.oldDeste.id;
    modalRef.componentInstance.nesne = 'deste';
    this.activeModal.close('Close click');
  }

  kartEkle(id:number) {
    const modalRef = this.modalService.open(KartEkleModel);
    modalRef.componentInstance.id = id;
    
  }


  updateDeste() {
    this.guncelDeste.setValue({
      name: this.oldDeste.name,
      renk: this.oldDeste.renk,
    });
  }

  desteGuncelle() {
    let d = Object.assign({}, this.guncelDeste.value);
    let name = d.name;
    let renk = d.renk;
    let id = this.oldDeste.id;

    this.desteService.desteGuncelle({ name, renk, id }).subscribe((res) => {
      console.log('deste guncellendi');
      window.location.reload();
    });
  }
}

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
  submitted = false;

  constructor(
    public desteService: DesteService,
    public fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.desteYeni = this.fb.group({
      name: ['',[ Validators.required]],
      renk: ['',[ Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getDesteler();
  }

  open(d: Deste) {
    //console.log(k);
    const modalRef = this.modalService.open(DesteGuncelle);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.oldDeste = d;
  }

  // kartEkle(id:number) {
  //   const modalRef = this.modalService.open(KartEkleModel);
  //   modalRef.componentInstance.id = id;
    
  // }

  getDesteler() {
    this.desteService.getUserProfile().subscribe((res) => {
      this.desteler = res.data;

      var kartlar = res.data.map((o) => o.kartlars);
      const usersCollection = [].concat(...kartlar);

      this.dataLoaded = true;
    });
  }

  getbgColor(renk: string) {
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
      case 'turuncu':
        renkClass = 'bg-c-orange';
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

  get f(): { [key: string]: AbstractControl } {
    return this.desteYeni.controls;
  }

  desteEkle() {

    this.submitted = true;
    if (this.desteYeni.invalid) {
      return;
    } 


    this.desteService.postNewDeste(this.desteYeni.value).subscribe((res) => {
      console.log('deste gonderildi ');
      console.log(res);
      this.desteEkleForm = false;
      window.location.reload();
    });
  }
}
