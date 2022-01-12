import { Component, OnInit, Input } from '@angular/core';
import { DesteService } from 'src/app/services/deste.service';
import { Deste } from 'src/app/models/deste';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SilmeSorgu } from '../kart/kart.component';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Deste guncelleme!</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
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
      <button
        type="submit"
        class="btn btn-block btn-danger mx-3"
        (click)="sil()"
      >
        sil
      </button>
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

  sil() {
    const modalRef = this.modalService.open(SilmeSorgu);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.id = this.oldDeste.id;
    modalRef.componentInstance.nesne = 'deste';
    this.activeModal.close('Close click');
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

    console.log(renk + ' - ' + name + ' - ' + id);
    this.desteService.desteGuncelle({ name, renk, id }).subscribe((res) => {
      console.log('deste guncellendi');
      window.location.reload();
    });
  }
}

//guncelleme için

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

  constructor(
    public desteService: DesteService,
    public fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.desteYeni = this.fb.group({
      name: [''],
      renk: [''],
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
    console.log('gelen reki ' + renk);
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

  desteEkle() {
    this.desteService.postNewDeste(this.desteYeni.value).subscribe((res) => {
      console.log('deste gonderildi ');
      console.log(res);
      this.desteEkleForm = false;
      window.location.reload();
    });
  }
}
