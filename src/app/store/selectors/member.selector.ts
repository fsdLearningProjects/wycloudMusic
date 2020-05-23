/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 18:15:40
 */
import { PlayState } from '../reducers/player.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppStoreModule } from '../app-store.module';
import { MemberState } from '../reducers/member.reducer';

const selectMemberStates = (state: MemberState) => state;

export const getModalVisible = createSelector(
    selectMemberStates,
    (state: MemberState) => state.modalVisible
);
export const getModalType = createSelector(
    selectMemberStates,
    (state: MemberState) => state.modalType
);

export const getMember = createFeatureSelector<MemberState>('member');
