/*
 * @Date: 2020-03-18 16:59:41
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 18:10:00
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SingerDetail, Song } from 'src/app/services/data-types/common.types';
import { SongService } from 'src/app/services/song/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store/app-store.module';
import {
    getPlayer,
    getCurrentSong
} from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-singer-detail',
    templateUrl: './singer-detail.component.html',
    styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
    singerDetail: SingerDetail;
    currentSong: Song;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private songService: SongService,
        private batchActionsService: BatchActionsService,
        private store$: Store<AppStoreModule>,
        private nzMessageService: NzMessageService
    ) {
        this.route.data
            .pipe(map(res => res.singerDetail))
            .subscribe(singerDetail => {
                this.singerDetail = singerDetail;
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

    // 添加歌单
    onAddSheet(songs: Song[], isPlay = false) {
        this.songService.getSongList(songs).subscribe(res => {
            if (res.length) {
                if (isPlay) {
                    this.batchActionsService.selectPlayList({ res, index: 0 });
                } else {
                    this.batchActionsService.addSheet(res);
                }
            } else {
                this.nzMessageService.create(
                    'warning',
                    '暂时无法添加 / 播放该歌单！'
                );
            }
        });
    }

    // 添加歌曲
    onAddSong(song: Song, isPlay = false) {
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
