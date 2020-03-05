import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store/app-store.module';
import { getSongList, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-types';
import { SetCurrentIndex } from 'src/app/store/actions/player.action';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';

interface PlayerSelectorState {
  type: (playState: PlayState) => Song[] | number | PlayMode | Song,
  cb: (item: Song[] | number | PlayMode | Song) => void
}

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, AfterViewInit {

  @ViewChild('audioElement', { static: true }) private audioElement: ElementRef;

  private audio: HTMLAudioElement;

  // 滑块的百分比
  percent = 0;
  // 缓冲条进度
  bufferPercent = 0;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  // 播放状态
  playing = false;
  // 是否可以播放
  songReady = false;
  // 音量
  volume = 60;
  // 是否显示音量面板
  showVolumePanel = false;
  // 是否点击的是音量面板本身
  selfClick = false;

  private winClick: Subscription;

  constructor(private store$: Store<AppStoreModule>, @Inject(DOCUMENT) private document: Document) {
    const appStore$ = this.store$.pipe(select(createFeatureSelector<PlayState>('player')));

    const stateArr: PlayerSelectorState[] = [
      {
        type: getSongList,
        cb: (list: Song[]) => this.watchList(list, 'songList')
      },
      {
        type: getPlayList,
        cb: (list: Song[]) => this.watchList(list, 'playList')
      },
      {
         type: getCurrentIndex,
        cb: (index: number) => this.watchCurrentIndex(index)
      },
      {
        type: getPlayMode,
       cb: (mode: PlayMode) => this.watchPlayMode(mode)
     },
     {
      type: getCurrentSong,
     cb: (song: Song) => this.watchCurrentSong(song)
   }
  ];

   stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.audio = this.audioElement.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('playMode', mode);
  }

  private watchCurrentSong(song: Song) {
    // 因为默认一开始音乐列表是没有音乐的，所以要做个判断，避免报错
    if (song) {
      this.currentSong = song;
      // 毫秒转化为秒
      this.duration = song.dt / 1000;
    } else {

    }
  }

  onPercentChange(percent: number) {
    if (this.currentSong) {
      this.audio.currentTime = this.duration * (percent / 100);
    }
  }

  // 控制音量
  onVolumeChange(volume: number) {
    // audio 的音量值为 0 到 1 之间
    this.audio.volume = volume / 100;
  }

  // 控制音量面板的显示
  toggleVolPanel(event: MouseEvent) {
    event.stopPropagation();
    this.togglePanel();
  }
  
  togglePanel() {
    this.showVolumePanel = !this.showVolumePanel;
    if (this.showVolumePanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.document, 'click').subscribe(res => {
        // 如果点击了播放器以外的地方
        if (!this.selfClick) {
          this.showVolumePanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  // 播放、暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }
    }
  }

  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) {
      return;
    }

    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) {
      return;
    }

    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  // 单曲循环
  private loop() {
    this.audio.currentTime = 0;
    this.play();
  }
  
  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  onCanPlay() {
    this.songReady = true;
    this.play();
  }

  onTimeUpdate(e: Event) {
    // 类型断言
    // 当前播放时间的秒数
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;

    const buffered = this.audio.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      // 当前歌曲缓冲块的结束时间 / 总时长
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  private play() {
    this.audio.play();
    this.playing = true;
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

}
