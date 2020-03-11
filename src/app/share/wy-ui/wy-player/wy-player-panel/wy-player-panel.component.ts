import { Component, OnInit, OnChanges, Input, SimpleChanges, EventEmitter, Output, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song/song.service';
import { WyLyric, lyricAndTimeLine, Handler } from './wy-lyric';

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
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  
  currentIndex: number;
  scrollY = 0;
  currentLyric: lyricAndTimeLine[];
  currentLyricNum: number;

  private lyric: WyLyric;
  private lyricRefs: NodeList;

  constructor(@Inject(WINDOW) private window: Window, private songService: SongService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }

    if (changes['songList']) {
      this.currentIndex = 0;
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        if (this.currentSong) {
          this.window.setTimeout(() => {
            this.scrollToCurrent(0);
          }, 100);
        }
      }
    }
  }

  private updateLyric() {
    // 重置歌词
    this.resetLyric();
    // 获取歌词
    this.songService.getSongLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res, this.window);
      this.currentLyric = this.lyric.lines;
      const startLine = res.tlyric ? 1 : 3;
      this.handleLyric(startLine);
      this.wyScroll.last.scrollTo(0, 0);

      if (this.playing) {
        this.lyric.play();
      }

    });
  }

  private handleLyric(startLine = 2) {
    this.lyric.handlerSubject.subscribe(( { lineIndex }: Handler ) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.element.nativeElement.querySelectorAll('ul li');
      }

      if (this.lyricRefs.length) {
        this.currentLyricNum = lineIndex;
        if (lineIndex > startLine) {
          // 为了确保正在播放的歌词始终居中
          const targetLine = this.lyricRefs[lineIndex - startLine];
          if (targetLine) {
            this.wyScroll.last.scrollToElement(<HTMLLIElement>targetLine, 300, false, false);
          }
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

  private scrollToCurrent(speed = 300) {
    const songListRefs = (<HTMLElement>this.wyScroll.first.element.nativeElement).querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      if ((offsetTop - Math.abs(this.scrollY) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

}
