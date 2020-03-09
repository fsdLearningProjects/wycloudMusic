import { Component, OnInit, OnChanges, Input, SimpleChanges, EventEmitter, Output, ViewChildren, QueryList, Inject } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from 'src/app/utils/array';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song/song.service';
import { WyLyric, lyricAndTimeLine } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  
  currentIndex: number;
  scrollY = 0;
  currentLyric: lyricAndTimeLine[];

  constructor(@Inject(WINDOW) private window: Window, private songService: SongService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    this.songService.getSongLyric(this.currentSong.id).subscribe(res => {
      const lyric = new WyLyric(res);
      this.currentLyric = lyric.lines;
    });
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
