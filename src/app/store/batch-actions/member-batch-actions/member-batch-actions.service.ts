/*
 * @Date: 2020-03-14 22:16:09
 * @LastEditors: fashandian
 * @LastEditTime: 2020-06-06 21:42:42
 */
import { Injectable } from '@angular/core';
import { AppStoreModule } from '../../app-store.module';
import { select, Store } from '@ngrx/store';
import { getMember } from '../../selectors/member.selector';
import { MemberState, ModalType } from '../../reducers/member.reducer';
import { SetModalVisible, SetModalType } from '../../actions/member.action';

@Injectable({
    providedIn: AppStoreModule,
})
export class MemberBatchActionsService {
    private memberState: MemberState;

    constructor(private store$: Store<AppStoreModule>) {
        this.store$
            .pipe(select(getMember))
            .subscribe((res) => (this.memberState = res));
    }

    // 会员弹窗显示隐藏
    controlModal(modalVisible: boolean, modalType: ModalType) {
        this.store$.dispatch(SetModalVisible({ modalVisible }));
        this.store$.dispatch(SetModalType({ modalType }));
    }
}
