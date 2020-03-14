/*
 * @Date: 2020-03-14 22:16:09
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-15 00:39:57
 */
import { Injectable } from '@angular/core';
import { AppStoreModule } from '../app-store.module';
import { Song } from 'src/app/services/data-types/common.types';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { PlayState } from '../reducers/player.reducer';
import {
    SetSongList,
    SetPlayList,
    SetCurrentIndex
} from '../actions/player.action';
import { shuffle, findIndex } from 'src/app/utils/array';

@Injectable({
    providedIn: AppStoreModule
})
export class BatchActionsService {
    private playState: PlayState;

    constructor(private store$: Store<AppStoreModule>) {
        this.store$
            .pipe(select(createFeatureSelector<PlayState>('player')))
            .subscribe(res => (this.playState = res));
    }
    // 播放列表
    selectPlayList({ res, index }: { res: Song[]; index: number }) {
        this.store$.dispatch(SetSongList({ songList: res }));

        let playIndex = index;
        // 避免引用问题
        let playList = res.slice();

        if (this.playState.playMode.type === 'random' && res) {
            playList = shuffle(res);
            playIndex = findIndex(playList, playList[playIndex]);
        }

        this.store$.dispatch(SetPlayList({ playList }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: playIndex }));
    }

    deleteSong(song: Song) {
        const songList = this.playState.songList.slice();
        const playList = this.playState.playList.slice();
        let currentIndex = this.playState.currentIndex;

        const sIndex = findIndex(songList, song);
        const pIndex = findIndex(playList, song);
        songList.splice(sIndex, 1);
        playList.splice(pIndex, 1);

        if (currentIndex > pIndex || currentIndex === playList.length) {
            currentIndex--;
        }

        this.store$.dispatch(SetSongList({ songList }));
        this.store$.dispatch(SetPlayList({ playList }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex }));
    }

    clearSong() {
        this.store$.dispatch(SetSongList({ songList: [] }));
        this.store$.dispatch(SetPlayList({ playList: [] }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
    }
}
