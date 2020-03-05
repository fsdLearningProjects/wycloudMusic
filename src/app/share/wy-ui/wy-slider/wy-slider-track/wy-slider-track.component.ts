import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WySliderStyle } from '../wy-slider-types';

@Component({
  selector: 'app-wy-slider-track',
  templateUrl: './wy-slider-track.component.html',
  styleUrls: ['./wy-slider-track.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {

  // 垂直还是水平
  @Input() wyVertical = false;
  // 是否是缓冲条
  @Input() wyBuffer = false;
  @Input() wyLength: number;

  style: WySliderStyle = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wyLength']) {
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.wyLength + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }

  ngOnInit(): void {
  }

}
