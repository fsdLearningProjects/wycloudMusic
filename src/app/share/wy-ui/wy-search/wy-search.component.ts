/*
 * @Date: 2020-03-19 18:38:49
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-20 05:32:05
 */
import {
    Component,
    OnInit,
    Input,
    TemplateRef,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import { fromEvent } from 'rxjs';
import {
    pluck,
    debounceTime,
    distinctUntilChanged
} from 'rxjs/internal/operators';
import { Search } from 'src/app/services/data-types/common.types';
import { isEmptyObject } from 'src/app/utils/tools';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@Component({
    selector: 'app-wy-search',
    templateUrl: './wy-search.component.html',
    styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() customView: TemplateRef<any>;
    @Input() searchResult: Search;
    // 要依附的元素模板
    @Input() connectedRef: ElementRef;
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onSearch = new EventEmitter<string>();

    @ViewChild('nzInput', { static: false }) private nzInputRef: ElementRef;
    @ViewChild('search', { static: false }) private searchRef: ElementRef;

    // 向外部组件暴露出去的值。可以放这里面
    myContext = {};
    // 生成的浮层 overlay 的实例
    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.searchResult && !changes.searchResult.firstChange) {
            if (!isEmptyObject(this.searchResult)) {
                this.showOverlayPanel();
            } else {
            }
        }
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        fromEvent(this.nzInputRef.nativeElement, 'input')
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                pluck('target', 'value')
            )
            .subscribe((value: string) => {
                this.onSearch.emit(value);
            });
    }

    onFocus() {
        if (this.searchResult && !isEmptyObject(this.searchResult)) {
            this.showOverlayPanel();
        }
    }

    hideOverlayPanel() {
        if (this.overlayRef && this.overlayRef.hasAttached) {
            this.overlayRef.dispose();
        }
    }

    showOverlayPanel() {
        // 隐藏浮层
        this.hideOverlayPanel();

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.connectedRef || this.searchRef)
            .withPositions([
                {
                    // 整个的意思就是浮层的左上角要对齐依附的元素的左下角
                    // 依附的元素的左下角
                    originX: 'start',
                    originY: 'bottom',
                    // 浮层的左上角
                    overlayX: 'start',
                    overlayY: 'top'
                }
            ])
            .withLockedPosition(true);
        this.overlayRef = this.overlay.create({
            // 生成一个蒙版，类似遮罩层
            hasBackdrop: true,
            positionStrategy,
            // 滚动的时候更新位置，配合 withLockedPosition 使用，这样子在滚动的时候，位置可以被锁死，不会一直 fix 在视口上
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });
        const panelPortal = new ComponentPortal(
            WySearchPanelComponent,
            this.viewContainerRef
        );
        const panelRef = this.overlayRef.attach(panelPortal);
        panelRef.instance.searchResult = this.searchResult;
        // 动态组件，无法在模板上监听 Output 事件，因此在父组件中订阅 Output 事件
        panelRef.instance.goPageEmitter.subscribe(() => {
            this.hideOverlayPanel();
        });

        // 监听蒙版的点击事件，在点击蒙版的时候关闭浮层
        this.overlayRef.backdropClick().subscribe(() => {
            this.hideOverlayPanel();
        });
    }
}
