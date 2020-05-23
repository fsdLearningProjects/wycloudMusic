/*
 * @Date: 2020-05-23 17:02:31
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 17:05:15
 */

import { createAction, props } from '@ngrx/store';
import { ModalType } from '../reducers/member.reducer';

export const SetModalVisible = createAction(
    '[member] set modal visible',
    props<{ modalVisible: boolean }>()
);
export const SetModalType = createAction(
    '[member] set modal type',
    props<{ modalType: ModalType }>()
);
