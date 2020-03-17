/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-17 16:44:03
 */
import { PlayState } from '../reducers/player.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppStoreModule } from '../app-store.module';

const selectPlayerStates = (state: PlayState) => state;

export const getPlaying = createSelector(
    selectPlayerStates,
    (state: PlayState) => state.playing
);
export const getPlayList = createSelector(
    selectPlayerStates,
    (state: PlayState) => state.playList
);
export const getSongList = createSelector(
    selectPlayerStates,
    (state: PlayState) => state.songList
);
export const getPlayMode = createSelector(
    selectPlayerStates,
    (state: PlayState) => state.playMode
);
export const getCurrentIndex = createSelector(
    selectPlayerStates,
    (state: PlayState) => state.currentIndex
);

export const getCurrentSong = createSelector(
    selectPlayerStates,
    ({ playList, currentIndex }: PlayState) => playList[currentIndex]
);

export const getPlayer = createFeatureSelector<AppStoreModule>('player');
