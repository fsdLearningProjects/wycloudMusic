/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-06-06 21:27:24
 */
import { createReducer, on, Action } from '@ngrx/store';
import { SetModalVisible, SetModalType } from '../actions/member.action';

export enum ModalType {
    Register = 'register',
    LoginByPhone = 'loginByPhone',
    Share = 'share',
    Like = 'like',
    Default = 'default',
}

export interface MemberState {
    modalVisible: boolean;
    modalType: ModalType;
}

export const initialState: MemberState = {
    modalVisible: false,
    modalType: ModalType.Default,
};

const reducer = createReducer(
    initialState,
    on(SetModalVisible, (state, { modalVisible }) => ({
        ...state,
        modalVisible,
    })),
    on(SetModalType, (state, { modalType }) => ({ ...state, modalType }))
);

export function MemberReducer(state: MemberState, action: Action) {
    return reducer(state, action);
}
