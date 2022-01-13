import { Component, OnInit,TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deste } from 'src/app/models/deste';
import { kart } from 'src/app/models/kart';
import { DesteService } from 'src/app/services/deste.service';

import { FormControl } from '@angular/forms';
import { SilmeSorgu,NgbdModalContent } from '../kart/kart.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from "src/app/services/toast.service"


@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastsContainer {
  constructor(public toastService: ToastService) {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}


@Component({
  selector: 'app-deste',
  templateUrl: './deste.component.html',
  styleUrls: ['./deste.component.css'],
})
export class DesteComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private desteService: DesteService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {
  }

  id: number;
  deste: Deste;
  dataLoaded = false;
  kartlar$: kart[];
  filter = new FormControl('');

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['desteId']) {
        this.getDeste(params['desteId']);
        this.id = params['desteId'];
      } else {
       
      }
    });
  }

  getDeste(id: number) {
    this.desteService.getOneDeste(id).subscribe((res) => {
      this.deste = res.data;
      this.kartlar$ = this.deste.kartlars
      this.dataLoaded = true;
    });
  }

  sil(id:number){
    const modalRef = this.modalService.open(SilmeSorgu);
    modalRef.componentInstance.nesne = "kart";
    modalRef.componentInstance.id = id; 
  }

  guncelle(k:kart){
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.oldKart = k;
  }

  showSuccess() {
    this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
  }


}
