/*
 * @Date: 2020-05-23 16:26:56
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 19:16:53
 */

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    ChangeDetectorRef,
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
} from '@angular/cdk/overlay';
import { MemberBatchActionsService } from 'src/app/store/batch-actions/member-batch-actions/member-batch-actions.service';

@Component({
    selector: 'app-wy-layer-modal',
    templateUrl: './wy-layer-modal.component.html',
    styleUrls: ['./wy-layer-modal.component.less'],
    // OnPush 策略只在输入属性发生变化时才会触发变更检测，当用store dispatch来修改状态时无法使该组件更新
    // 因此，需要使用 ChangeDetectorRef 来进行通知变更检测
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerModalComponent implements OnInit {
    showModal = false;

    private visible: boolean;
    private currentModalType: ModalType;
    private overlayRef: OverlayRef;
    private blockScrollStrategy: BlockScrollStrategy;

    constructor(
        private store$: Store<AppStoreModule>,
        private overlay: Overlay,
        private elementRef: ElementRef,
        private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private memberBatchActionsService: MemberBatchActionsService
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

    ngOnInit(): void {
        this.createOverlay();
    }

    hide() {
        this.memberBatchActionsService.controlModal(false);
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
        } else {
            // ?. 这样子就不会报 Cannot read property 'disable' of undefined 了
            this.blockScrollStrategy?.disable();
            this.overlayKeyboardDispatcher.remove(this.overlayRef);
        }
        // 标记该组件需要进行变更检测
        this.changeDetectorRef.markForCheck();
    }
}
