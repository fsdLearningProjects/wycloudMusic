import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { CurrentActions } from '../reducers/player.reducer';

export const SetPlaying = createAction(
    '[player] set playing',
    props<{ playing: boolean }>()
);
export const SetPlayList = createAction(
    '[player] set playList',
    props<{ playList: Song[] }>()
);
export const SetSongList = createAction(
    '[player] set songLlist',
    props<{ songList: Song[] }>()
);
export const SetPlayMode = createAction(
    '[player] set playMode',
    props<{ playMode: PlayMode }>()
);
export const SetCurrentIndex = createAction(
    '[player] set currentIndex',
    props<{ currentIndex: number }>()
);
export const SetCurrentAction = createAction(
    '[player] set currentAction',
    props<{ currentAction: CurrentActions }>()
);
