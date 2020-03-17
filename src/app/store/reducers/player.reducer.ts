/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-17 16:42:02
 */
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { Song } from 'src/app/services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import {
    SetPlaying,
    SetPlayList,
    SetSongList,
    SetPlayMode,
    SetCurrentIndex
} from '../actions/player.action';

export interface PlayState {
    /** 播放状态 */
    playing: boolean;
    /** 播放模式 */
    playMode: PlayMode;
    /** 歌曲列表 */
    songList: Song[];
    /** 播放列表 */
    playList: Song[];
    /** 当前正在播放的索引 */
    currentIndex: number;
}

export const initialState: PlayState = {
    playing: false,
    playMode: {
        type: 'loop',
        label: '循环'
    },
    songList: [],
    playList: [],
    currentIndex: -1
};

const reducer = createReducer(
    initialState,
    on(SetPlaying, (state, { playing }) => ({ ...state, playing })),
    on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
    on(SetSongList, (state, { songList }) => ({ ...state, songList })),
    on(SetPlayMode, (state, { playMode }) => ({ ...state, playMode })),
    on(SetCurrentIndex, (state, { currentIndex }) => ({
        ...state,
        currentIndex
    }))
);

export function PlayerReducer(state: PlayState, action: Action) {
    return reducer(state, action);
}
