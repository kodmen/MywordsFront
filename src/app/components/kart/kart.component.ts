import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { kart } from 'src/app/models/kart';
import { KartService } from 'src/app/services/kart.service';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DesteService } from 'src/app/services/deste.service';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

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
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private kartService: KartService
  ) {
    this.guncelKart = this.fb.group({
      onYuz: [''],
      arkaYuz: [''],
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

    if (onYuz == '' || arkaYuz == '') {
      alert('iki alanda boş olamaz');
    }
    {
      let id = this.oldKart.id;
      console.log(onYuz + ' - ' + arkaYuz + ' - ' + id);
      this.kartService.kartGuncelle({ onYuz, arkaYuz, id }).subscribe((res) => {
        console.log('kart guncellendi');
        window.location.reload();
      });
    }
  }
}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">kart Silme!</h4>
    </div>

    <div class="modal-body">
      <button
        type="submit"
        class="btn btn-block btn-danger mx-3 w-25"
        (click)="sil()"
      >
        sil
      </button>
      <button
        type="submit"
        class="btn btn-block btn-primary mx-3 w-25"
        (click)="activeModal.close('Close click')"
      >
        vazgeç
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
export class SilmeSorgu implements OnInit {
  @Input() oldKart;
  @Input() id;
  @Input() nesne;

  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private kartService: KartService,
    private desteService: DesteService
  ) {}
  ngOnInit(): void {}

  sil() {
    if (this.nesne == 'kart') {
      this.kartService.kartSil(this.id).subscribe((res) => {
        console.log('kart silindi');
        window.location.reload();
      });
    } else if (this.nesne == 'deste') {
      this.desteService.desteSil(this.id).subscribe((res) => {
        console.log('deste silindi');
        window.location.reload();
      });
    }
  }
}

@Component({
  selector: 'app-kart',
  templateUrl: './kart.component.html',
  styleUrls: ['./kart.component.css'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(179deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
    ]),
  ],
})
export class KartComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private kartService: KartService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private renderer: Renderer2
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
  current = 0;
  prev = -1;
  flip: string = 'inactive';

  toggleFlip() {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

  onYuzCevir() {
    if (this.flip == 'active') {
      this.flip = 'inactive';
    }
  }

  onPrev() {
    this.onYuzCevir();
    this.prev = this.current--;
    if (this.current < 0) {
      this.current = this.kartlar.length - 1;
      this.prev = this.current;
    }
  }

  onNext() {
    this.onYuzCevir();
    this.prev = this.current++;
    if (this.current > this.kartlar.length - 1) {
      this.current = 0;
      this.prev = this.current;
    }
  }

  isLeftTransition(idx: number): boolean {
    return this.current === idx
      ? this.prev > this.current
      : this.prev < this.current;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['desteId']) {
        this.getKartbyDesteId(params['desteId']);
        this.id = params['desteId'];
      } else {
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
}
