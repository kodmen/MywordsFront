import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { kart } from 'src/app/models/kart';
import { KartService } from 'src/app/services/kart.service';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">kart guncelleme!</h4>
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
        [formGroup]="guncelKart"
        (ngSubmit)="kartGuncelle()"
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
          guncelle
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
export class NgbdModalContent implements OnInit {
  @Input() name;
  @Input() oldKart;

  guncelKart: FormGroup;
  constructor(public fb: FormBuilder, public activeModal: NgbActiveModal,private kartService: KartService,) {
    this.guncelKart = this.fb.group({
      onYuz: [''],
      arkaYuz: ['']
    });
    
  }

  ngOnInit(): void {
    this.updateKard();
  }

  
  updateKard() {
    this.guncelKart.setValue({
      onYuz: this.oldKart.onYuz,
      arkaYuz: this.oldKart.arkaYuz,
    });
  }

  kartGuncelle() {
    let kart = Object.assign({}, this.guncelKart.value);
    let onYuz = kart.onYuz;
    let arkaYuz = kart.arkaYuz;
    let id = this.oldKart.id;
    console.log(onYuz+" - "+ arkaYuz+" - "+id);
    this.kartService.kartGuncelle({onYuz,arkaYuz,id}).subscribe(res=>{
      console.log("kart guncellendi")
      window.location.reload();
    })

  }
}

@Component({
  selector: 'app-kart',
  templateUrl: './kart.component.html',
  styleUrls: ['./kart.component.css'],
})
export class KartComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private kartService: KartService,
    public fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.kartYeni = this.fb.group({
      onYuz: [''],
      arkaYuz: [''],
    });
  }

  kartlar: kart[] = [];
  dataLoaded = false;
  id: number;
  kartYeni: FormGroup;
  kartEkleForm = false;

  open(k: kart) {
    //console.log(k);
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.oldKart = k;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['desteId']) {
        this.getKartbyDesteId(params['desteId']);
        this.id = params['desteId'];
      } else {
        //kart yok ekleyin yazıyı koyulacak
        //this.getProducts()
      }
    });
  }

  getKartbyDesteId(id: number) {
    this.kartService.getAllKartByDesteId(id).subscribe((res) => {
      this.kartlar = res.data;
      console.log(this.kartlar);
      this.dataLoaded = true;
    });
  }

  kartEkleFormAc() {
    this.kartEkleForm = true;
  }

  kartEkleFormKapat() {
    this.kartEkleForm = false;
  }

  kartsteEkle() {
    let userModel = Object.assign({}, this.kartYeni.value);
    const onYuz = userModel.onYuz;
    const arkaYuz = userModel.arkaYuz;
    const desteId = this.id;

    this.kartService
      .postNewKart({ onYuz, arkaYuz, desteId })
      .subscribe((res) => {
        console.log('deste gonderildi ');
        console.log(res);
        this.kartEkleForm = false;
        window.location.reload();
      });
  }
}
