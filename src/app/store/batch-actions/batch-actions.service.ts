/*
 * @Date: 2020-03-14 22:16:09
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-17 20:00:28
 */
import { Injectable } from '@angular/core';
import { AppStoreModule } from '../app-store.module';
import { Song } from 'src/app/services/data-types/common.types';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { PlayState } from '../reducers/player.reducer';
import {
    SetSongList,
    SetPlayList,
    SetCurrentIndex,
    SetPlaying
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

    addSheet(songs: Song[]) {
        const songList = this.playState.songList.slice();
        const playList = this.playState.playList.slice();
        songs.forEach(song => {
            const playIndex = findIndex(playList, song);
            if (playIndex === -1) {
                songList.push(song);
                playList.push(song);
            }
        });
        this.store$.dispatch(SetSongList({ songList }));
        this.store$.dispatch(SetPlayList({ playList }));
    }

    // 添加歌曲
    addSong(song: Song, isPlay = false) {
        const songList = this.playState.songList.slice();
        const playList = this.playState.playList.slice();
        let index = this.playState.currentIndex;
        const playIndex = findIndex(playList, song);
        if (playIndex > -1) {
            // 歌曲已经存在播放列表中
            if (isPlay) {
                index = playIndex;
            }
        } else {
            songList.push(song);
            playList.push(song);
            if (isPlay) {
                index = playList.length - 1;
            }
            this.store$.dispatch(SetSongList({ songList }));
            this.store$.dispatch(SetPlayList({ playList }));
        }

        if (index !== this.playState.currentIndex) {
            this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
        }
    }

    // 删除歌曲
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

    // 清空歌曲
    clearSong() {
        this.store$.dispatch(SetSongList({ songList: [] }));
        this.store$.dispatch(SetPlayList({ playList: [] }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
    }
}
