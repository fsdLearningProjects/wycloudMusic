import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  // 将该组件的变更检测改为当输入输出发生变化时才会触发变更检测
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCarouselComponent implements OnInit {

  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();

  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;


  constructor() { }

  ngOnInit(): void {
  }

  onChangeSlide(type: 'pre' | 'next'): void {
    this.changeSlide.emit(type);
  }

}
