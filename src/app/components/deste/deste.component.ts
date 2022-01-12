import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deste } from 'src/app/models/deste';
import { kart } from 'src/app/models/kart';
import { DesteService } from 'src/app/services/deste.service';

import { FormControl } from '@angular/forms';
import { SilmeSorgu,NgbdModalContent } from '../kart/kart.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deste',
  templateUrl: './deste.component.html',
  styleUrls: ['./deste.component.css'],
})
export class DesteComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private desteService: DesteService,
    private modalService: NgbModal
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



}
