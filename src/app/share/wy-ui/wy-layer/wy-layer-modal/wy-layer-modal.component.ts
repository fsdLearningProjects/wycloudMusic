/*
 * @Date: 2020-05-23 16:26:56
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-30 22:42:29
 */

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    ChangeDetectorRef,
    ViewChild,
    Renderer2,
    AfterViewInit,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store/app-store.module';
import {
    getModalVisible,
    getModalType,
    getMember,
} from 'src/app/store/selectors/member.selector';
import { ModalType } from 'src/app/store/reducers/member.reducer';
import {
    Overlay,
    OverlayRef,
    OverlayKeyboardDispatcher,
    BlockScrollStrategy,
    OverlayContainer,
} from '@angular/cdk/overlay';
import { MemberBatchActionsService } from 'src/app/store/batch-actions/member-batch-actions/member-batch-actions.service';
import { layoutCenter } from 'src/app/utils/dom';
import {
    trigger,
    state,
    transition,
    animate,
    style,
} from '@angular/animations';

@Component({
    selector: 'app-wy-layer-modal',
    templateUrl: './wy-layer-modal.component.html',
    styleUrls: ['./wy-layer-modal.component.less'],
    // OnPush 策略只在输入属性发生变化时才会触发变更检测，当用store dispatch来修改状态时无法使该组件更新
    // 因此，需要使用 ChangeDetectorRef 来进行通知变更检测
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('showHide', [
            state('show', style({ transform: 'scale(1)', opacity: 1 })),
            state('hide', style({ transform: 'scale(0)', opacity: 0 })),
            transition('show<=>hide', animate('0.1s')),
        ]),
    ],
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
    showModal = false;

    private visible: boolean;
    private currentModalType: ModalType;
    private overlayRef: OverlayRef;
    private blockScrollStrategy: BlockScrollStrategy;
    private overlayContainerElement: HTMLElement;

    @ViewChild('modalContainer', { static: false })
    private modalRef: ElementRef;

    private resizeHandler: () => void = () => {};

    constructor(
        private store$: Store<AppStoreModule>,
        private overlay: Overlay,
        private elementRef: ElementRef,
        private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private memberBatchActionsService: MemberBatchActionsService,
        private renderer2: Renderer2,
        private overlayContainer: OverlayContainer
    ) {
        const appStore$ = this.store$.pipe(select(getMember));
        // 值变更后，会发射数据
        appStore$
            .pipe(select(getModalVisible))
            .subscribe((visible) => this.watchModalVisible(visible));
        appStore$
            .pipe(select(getModalType))
            .subscribe((type) => this.watchModalType(type));

        this.blockScrollStrategy = this.overlay.scrollStrategies.block();
    }
    ngAfterViewInit() {
        this.overlayContainerElement = this.overlayContainer.getContainerElement();
    }

    ngOnInit() {
        this.createOverlay();
    }

    hide() {
        this.memberBatchActionsService.controlModal(false);
    }

    private changePointerEvents(type: 'auto' | 'none') {
        if (!this.overlayContainerElement) {
            return;
        }

        this.overlayContainerElement.style.pointerEvents = type;
    }

    private calculatePosition() {
        if (!this.modalRef) {
            return;
        }
        const modal = this.modalRef.nativeElement;
        // 居中
        layoutCenter(modal);
        // 窗口变化时重新居中
        this.resizeHandler = this.renderer2.listen('window', 'resize', () =>
            layoutCenter(modal)
        );
    }

    private createOverlay() {
        this.overlayRef = this.overlay.create();
        this.overlayRef.overlayElement.appendChild(
            this.elementRef.nativeElement
        );

        this.overlayRef
            .keydownEvents()
            .subscribe((event) => this.keydownListener(event));
    }

    private keydownListener(event: KeyboardEvent) {
        // console.log(event);
        if (event.key === 'Escape') {
            this.hide();
        }
    }

    private watchModalVisible(visible: boolean) {
        this.visible = visible;
        this.handleVisibleChange(visible);
    }

    private watchModalType(type: ModalType) {
        this.currentModalType = type;
    }

    private handleVisibleChange(visible: boolean) {
        this.showModal = visible;
        // 只在 overlayRef 面板上监听键盘事件
        if (visible) {
            this.blockScrollStrategy?.enable();
            this.overlayKeyboardDispatcher.add(this.overlayRef);
            this.calculatePosition();
            this.changePointerEvents('auto');
        } else {
            // ?. 这样子就不会报 Cannot read property 'disable' of undefined 了
            this.blockScrollStrategy?.disable();
            this.overlayKeyboardDispatcher.remove(this.overlayRef);
            this.resizeHandler();
            this.changePointerEvents('none');
        }
        // 标记该组件需要进行变更检测
        this.changeDetectorRef.markForCheck();
    }
}
