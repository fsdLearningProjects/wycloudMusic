/*
 * @Date: 2020-03-18 02:49:01
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 04:43:58
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/services/data-types/common.types';
import {
    WyLyric,
    LyricAndTimeLine
} from 'src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { SongService } from 'src/app/services/song/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppStoreModule } from 'src/app/store/app-store.module';
import { Store, select } from '@ngrx/store';
import {
    getPlayer,
    getCurrentSong
} from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-song-detail',
    templateUrl: './song-detail.component.html',
    styleUrls: ['./song-detail.component.less']
})
export class SongDetailComponent implements OnInit, OnDestroy {
    song: Song;
    lyric: LyricAndTimeLine[];

    controlLyric = {
        isExpand: false,
        label: '展开',
        iconClass: 'down'
    };

    currentSong: Song;
    destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private songService: SongService,
        private batchActionsService: BatchActionsService,
        private nzMessageService: NzMessageService,
        private store$: Store<AppStoreModule>
    ) {
        this.route.data
            .pipe(map(res => res.songDetail))
            .subscribe(([song, lyric]) => {
                this.song = song;
                this.lyric = new WyLyric(lyric).lines;
                this.listenCurrentSong();
            });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    listenCurrentSong() {
        this.store$
            .pipe(
                select(getPlayer),
                select(getCurrentSong),
                takeUntil(this.destroy$)
            )
            .subscribe(song => (this.currentSong = song));
    }

    toggleLyric() {
        this.controlLyric.isExpand = !this.controlLyric.isExpand;
        if (this.controlLyric.isExpand) {
            this.controlLyric.label = '收起';
            this.controlLyric.iconClass = 'up';
        } else {
            this.controlLyric.label = '展开';
            this.controlLyric.iconClass = 'down';
        }
    }

    onAddSong(song: Song, isPlay = false) {
        if (!this.currentSong || this.currentSong.id !== song.id) {
            this.songService.getSongList(song).subscribe(res => {
                if (res.length) {
                    this.batchActionsService.addSong(res[0], isPlay);
                } else {
                    this.nzMessageService.create(
                        'warning',
                        '暂时无法添加 / 播放该歌曲！'
                    );
                }
            });
        }
    }
}
