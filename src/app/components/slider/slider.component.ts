import { Component, OnInit,Input } from '@angular/core';
import {
  slideInLeftAnimation,
  slideInRightAnimation,
  slideOutLeftAnimation,
  slideOutRightAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  animations: [
    slideInLeftAnimation({duration: 500}),
    slideInRightAnimation({duration: 500}),
    slideOutLeftAnimation({duration: 500}),
    slideOutRightAnimation({duration: 500}),
  ]
})
export class SliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() isIn = true;
  @Input() left = true;

  get right() {
    return !this.left;
  }

  get isOut() {
    return !this.isIn;
  }

}
