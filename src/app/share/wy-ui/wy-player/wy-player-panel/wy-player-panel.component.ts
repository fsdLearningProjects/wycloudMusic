import {
    Component,
    OnInit,
    OnChanges,
    Input,
    SimpleChanges,
    EventEmitter,
    Output,
    ViewChildren,
    QueryList,
    Inject
} from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song/song.service';
import { WyLyric, LyricAndTimeLine, Handler } from './wy-lyric';

@Component({
    selector: 'app-wy-player-panel',
    templateUrl: './wy-player-panel.component.html',
    styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
    @Input() playing: boolean;
    @Input() songList: Song[];
    @Input() currentSong: Song;
    @Input() show: boolean;
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onClose = new EventEmitter<void>();
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onChangeSong = new EventEmitter<Song>();
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onDeleteSong = new EventEmitter<Song>();
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onClearSong = new EventEmitter<void>();

    @ViewChildren(WyScrollComponent) private wyScroll: QueryList<
        WyScrollComponent
    >;

    currentIndex: number;
    scrollY = 0;
    currentLyric: LyricAndTimeLine[];
    currentLyricNum: number;

    private lyric: WyLyric;
    private lyricRefs: NodeList;
    private startLine = 2;

    constructor(
        @Inject(WINDOW) private window: Window,
        private songService: SongService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.playing) {
            if (!changes.playing.firstChange) {
                // tslint:disable-next-line: no-unused-expression
                this.lyric && this.lyric.togglePlay(this.playing);
            }
        }

        if (changes.songList) {
            this.updateCurrentIndex();
        }

        if (changes.currentSong) {
            if (this.currentSong) {
                this.updateCurrentIndex();
                this.updateLyric();
                if (this.show) {
                    this.scrollToCurrentSong();
                }
            } else {
                this.resetLyric();
            }
        }

        if (changes.show) {
            if (!changes.show.firstChange && this.show) {
                this.wyScroll.first.refreshScroll();
                this.wyScroll.last.refreshScroll();
                this.window.setTimeout(() => {
                    if (this.currentSong) {
                        this.scrollToCurrentSong(0);
                    }
                    if (this.currentLyric && this.lyricRefs?.length) {
                        this.scrollToCurrentLyric(0);
                    }
                }, 100);
            }
        }
    }

    private updateCurrentIndex() {
        this.currentIndex = findIndex(this.songList, this.currentSong);
    }

    private updateLyric() {
        // 重置歌词
        this.resetLyric();
        // 获取歌词
        this.songService.getSongLyric(this.currentSong.id).subscribe(res => {
            this.lyric = new WyLyric(res);
            this.currentLyric = this.lyric.lines;
            this.startLine = res.tlyric ? 1 : 3;
            this.handleLyric();
            this.wyScroll.last.scrollTo(0, 0);

            if (this.playing) {
                this.lyric.play();
            }
        });
    }

    private handleLyric() {
        this.lyric.handlerSubject.subscribe(({ lineIndex }: Handler) => {
            if (!this.lyricRefs) {
                this.lyricRefs = this.wyScroll.last.element.nativeElement.querySelectorAll(
                    'ul li'
                );
            }

            if (this.lyricRefs.length) {
                this.currentLyricNum = lineIndex;
                if (lineIndex > this.startLine) {
                    // 为了确保正在播放的歌词始终居中
                    this.scrollToCurrentLyric();
                } else {
                    this.wyScroll.last.scrollTo(0, 0);
                }
            }
        });
    }

    private resetLyric() {
        if (this.lyric) {
            this.lyric.stop();
            this.lyric = null;
            this.currentLyric = [];
            this.currentLyricNum = 0;
            this.lyricRefs = null;
        }
    }

    seekLyric(time) {
        if (this.lyric) {
            this.lyric.seek(time);
        }
    }

    private scrollToCurrentSong(speed = 300) {
        const songListRefs = (this.wyScroll.first.element
            .nativeElement as HTMLElement).querySelectorAll('ul li');
        if (songListRefs.length) {
            const currentLi = songListRefs[
                this.currentIndex || 0
            ] as HTMLElement;
            const offsetTop = currentLi.offsetTop;
            const offsetHeight = currentLi.offsetHeight;
            if (
                offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 ||
                offsetTop < Math.abs(this.scrollY)
            ) {
                this.wyScroll.first.scrollToElement(
                    currentLi,
                    speed,
                    false,
                    false
                );
            }
        }
    }

    private scrollToCurrentLyric(speed = 300) {
        const targetLine = this.lyricRefs[
            this.currentLyricNum - this.startLine
        ];
        if (targetLine) {
            this.wyScroll.last.scrollToElement(
                targetLine as HTMLLIElement,
                speed,
                false,
                false
            );
        }
    }
}
