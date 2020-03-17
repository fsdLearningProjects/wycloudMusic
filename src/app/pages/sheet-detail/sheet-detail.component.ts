/*
 * @Date: 2020-03-16 17:58:56
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-17 21:15:42
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SongSheet, Song } from 'src/app/services/data-types/common.types';
import { AppStoreModule } from 'src/app/store/app-store.module';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
    getCurrentSong,
    getPlayer
} from 'src/app/store/selectors/player.selector';
import { SongService } from 'src/app/services/song/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-sheet-detail',
    templateUrl: './sheet-detail.component.html',
    styleUrls: ['./sheet-detail.component.less']
})
export class SheetDetailComponent implements OnInit, OnDestroy {
    sheetDetail: SongSheet;
    description = {
        short: '',
        long: ''
    };
    controlDesc = {
        isExpand: false,
        label: '展开',
        iconClass: 'down'
    };

    currentSong: Song;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private store$: Store<AppStoreModule>,
        private songService: SongService,
        private batchActionsService: BatchActionsService,
        private nzMessageService: NzMessageService
    ) {
        this.route.data.pipe(map(res => res.sheetDetail)).subscribe(res => {
            this.sheetDetail = res;
            if (res.description) {
                this.changeDesc(res.description);
            }
            this.listenCurrentSong();
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // 监听当前歌曲
    private listenCurrentSong() {
        this.store$
            .pipe(
                select(getPlayer),
                select(getCurrentSong),
                takeUntil(this.destroy$)
            )
            .subscribe((song: Song) => {
                this.currentSong = song;
            });
    }

    toggleDesc() {
        this.controlDesc.isExpand = !this.controlDesc.isExpand;
        if (this.controlDesc.isExpand) {
            this.controlDesc.label = '收起';
            this.controlDesc.iconClass = 'up';
        } else {
            this.controlDesc.label = '展开';
            this.controlDesc.iconClass = 'down';
        }
    }

    private changeDesc(desc: string) {
        if (desc.length < 99) {
            this.description.short = this.replaceBr('<b>介绍：</b>' + desc);
            this.description.long = '';
        } else {
            this.description.short =
                this.replaceBr('<b>介绍：</b>' + desc.slice(0, 99)) + '...';
            this.description.long = this.replaceBr('<b>介绍：</b>' + desc);
        }
    }

    private replaceBr(desc: string) {
        return desc.replace(/\n/g, '<br />');
    }

    // 播放歌曲
    onAddSong(song: Song, isPlay = false) {
        if (!this.currentSong || this.currentSong.id !== song.id) {
            this.songService.getSongList(song).subscribe(list => {
                if (list.length) {
                    this.batchActionsService.addSong(list[0], isPlay);
                } else {
                    this.nzMessageService.create(
                        'warning',
                        '暂时无法添加 / 播放该歌曲！'
                    );
                }
            });
        }
    }

    // 播放歌单
    onAddSheet(songs: Song[], isPlay = false) {
        this.songService.getSongList(songs).subscribe(list => {
            if (list.length) {
                if (isPlay) {
                    this.batchActionsService.selectPlayList({
                        res: list,
                        index: 0
                    });
                } else {
                    this.batchActionsService.addSheet(list);
                }
            } else {
                this.nzMessageService.create(
                    'warning',
                    '暂时无法添加 / 播放该歌单！'
                );
            }
        });
    }
}
