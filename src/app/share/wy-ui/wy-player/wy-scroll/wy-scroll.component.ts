import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, Inject, OnDestroy } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WINDOW } from 'src/app/services/services.module';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .wy-scroll {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  
  @Input() data: Song[];
  @Input() refreshDelay = 50;
  @Output() private onScrollEnd = new EventEmitter<number>()
  
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  
  private bs: BScroll;
  
  constructor(readonly element: ElementRef, @Inject(WINDOW) private window: Window) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshScroll();
    }
  }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollY: true,
      scrollbar: {
        interactive: true
      },
      mouseWheel: true
    });
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }
  
  ngOnDestroy(): void {
    this.bs.destroy();
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    this.window.setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }

  scrollToElement(...args: [HTMLElement, number, boolean, boolean]) {
    this.bs.scroller.scrollToElement.apply(this.bs.scroller, args);
  }

  scrollTo(...args: [number, number]) {
    this.bs.scroller.scrollTo.apply(this.bs.scroller, args);
  }

}
