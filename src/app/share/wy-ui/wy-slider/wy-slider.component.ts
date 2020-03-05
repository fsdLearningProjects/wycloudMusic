import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject, ChangeDetectorRef, OnDestroy, forwardRef, EventEmitter, Output } from '@angular/core';
import { fromEvent, Observable, merge, Subscription } from 'rxjs';
import { tap, filter, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent, getElementOffset } from './wy-slider-helper';
import { limitNumberInRange, getPercent } from 'src/app/utils/number';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    multi: true
  }]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @Input() bufferOffset = 0;
  @Output() wyOnAfterChange = new EventEmitter<SliderValue>();

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private sliderDom: HTMLDivElement;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  private dragStartSubscription: Subscription | null;
  private dragMoveSubscription: Subscription | null;
  private dragEndSubscription: Subscription | null;

  private isDragging = false;

  /** 具体的值 */
  value: SliderValue = null;
  /** 将具体的值转化为对应的 dom 上的百分比 */
  offset: SliderValue = null;

  constructor(@Inject(DOCUMENT) private document: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObervables();
    this.subscribeDrag(['start']);
  }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }

  private createDraggingObervables() {

    const orientField = this.wyVertical ? 'pageY' : 'pageX';

    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filterHandle: (e: Event) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filterHandle: (e: Event) => e instanceof TouchEvent,
      pluckKey: [orientField]
    };

    [mouse, touch].forEach(item => {
      const { start, move, end, filterHandle, pluckKey} = item;
      item.startPlucked$ = fromEvent(this.sliderDom, start)
      .pipe(
        filter(filterHandle),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findClosesValue(position))
      );

      item.end$ = fromEvent(this.document, end);

      item.moveResolved$ = fromEvent(this.document, move)
      .pipe(
        filter(filterHandle),
        tap(sliderEvent),
        pluck(...pluckKey),
        // 因为 move 事件会频繁触发，因此设置成当值变化时才继续发射值
        distinctUntilChanged(),
        map((position: number) => this.findClosesValue(position)),
        // 当 end 发出流的时候，move 流就应该结束了
        takeUntil(item.end$)
      );

    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);

  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if (events.includes('start') && this.dragStart$ && !this.dragStartSubscription) {
      this.dragStartSubscription = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }

    if (events.includes('move') && this.dragStart$ && !this.dragMoveSubscription) {
      this.dragMoveSubscription = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }

    if (events.includes('end') && this.dragStart$ && !this.dragEndSubscription) {
      this.dragEndSubscription = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unSubscribeDrag(events: string[] = ['start', 'move', 'end']): void {
    if (events.includes('start') && this.dragStartSubscription) {
      this.dragStartSubscription.unsubscribe();
      this.dragStartSubscription = null;
    }

    if (events.includes('move') && this.dragMoveSubscription) {
      this.dragMoveSubscription.unsubscribe();
      this.dragMoveSubscription = null;
    }

    if (events.includes('end') && this.dragEndSubscription) {
      this.dragEndSubscription.unsubscribe();
      this.dragEndSubscription = null;
    }
  }

  private onDragStart(value: number) {
    this.toggleDragMoving(true);
    this.setValue(value);
  }

  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      // 由于该组件使用的是 onPush 的变更检测策略，因此当输入输出属性未发生变化时，该组件不会进行变更检测，
      // 因此 value 的值则不会发生变化，所以这里要手动进行一次变更检测
      this.cdr.markForCheck();
    }
  }

  private onDragEnd() {
    this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    // 手动进行一次变更检测
    this.cdr.markForCheck();
  }

  private toggleDragMoving(movable: boolean) {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unSubscribeDrag(['move', 'end']);
    }
  }

  private setValue(value: SliderValue, needCheck = false) {
    if (needCheck) {
      // 如果是拖拽中，则不进行检测
      if (this.isDragging) {
        return;
      }

      this.value = this.formatValue(value);
      this.updateTrackAndHandles();

    } else if (!this.valuesEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }

  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberInRange(value, this.wyMin, this.wyMax);
    }
    return res;
  }

  /** 判断是否是NaN */
  private assertValueValid(value: SliderValue): boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }

  private valuesEqual(oldValue: SliderValue, newValue: SliderValue): boolean {
    if (typeof oldValue !== typeof newValue) {
      return false;
    }
    return oldValue === newValue;
  }

  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    // 手动进行一次变更检测
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(this.wyMin, this.wyMax, value);
  }

  private findClosesValue(position): number {
    // 滑块组件总长
    const sliderLength = this.getSliderLength();
    // 滑块（左、上）端点的位置
    const sliderStart = this.getSliderStartPosition();
    // 滑块当前位置 / 滑块组件总长
    const ratioTemp = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    // 由于垂直方向上，滑块是从下往上滑动的，而获取到的是上端点的值，因此在垂直方向上要用整体的 100% 减去上面的那部分比例
    const ratio = this.wyVertical ? 1 - ratioTemp : ratioTemp;
    // 滑块位置 / 滑块组件总长 = (val - min) / (max - min)，其中等式右边的均为值，而不是位置信息
    return ratio * (this.wyMax - this.wyMin) + this.wyMin;
  }

  private getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition() {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }

  /** 实现 ControlValueAccessor 的方法，用以实现 [(ngModel)] 的功能 */
  private onValueChange(value: SliderValue): void {}

  private onTouched():void {}

  // 赋值
  writeValue(value: SliderValue): void {
    // 由于这里是外部传入的值，所以需要进行值的合法性检查
    this.setValue(value, true);
  }
  // 发射事件
  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }
  // 发射事件
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error("Method not implemented.");
  // }

  /** 实现 ControlValueAccessor 的方法，用以实现 [(NgModule)] 的功能 */

}
