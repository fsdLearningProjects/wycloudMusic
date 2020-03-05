import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WySliderStyle } from '../wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  templateUrl: './wy-slider-handle.component.html',
  styleUrls: ['./wy-slider-handle.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit, OnChanges {

  @Input() wyVertical = false;
  @Input() wyOffset: number;

  style: WySliderStyle = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wyOffset']) {
      this.style[this.wyVertical ? 'bottom' : 'left'] = this.wyOffset + '%';
    }
  }

  ngOnInit(): void {
  }

}
