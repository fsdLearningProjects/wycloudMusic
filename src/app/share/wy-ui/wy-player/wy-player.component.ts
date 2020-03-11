import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store/app-store.module';
import { getSongList, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-types';
import { SetCurrentIndex, SetPlayMode, SetPlayList } from 'src/app/store/actions/player.action';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';

interface PlayerSelectorState {
  type: (playState: PlayState) => Song[] | number | PlayMode | Song,
  cb: (item: Song[] | number | PlayMode | Song) => void
}

const MODE_PLAY: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  },
  {
    type: 'random',
    label: '随机'
  },
  {
    type: 'singleLoop',
    label: '单曲循环'
  }
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit, AfterViewInit {

  @ViewChild('audioElement', { static: true }) private audioElement: ElementRef;
  // 因为是有显示跟隐藏的，所以 static 为false
  @ViewChild(WyPlayerPanelComponent, { static: false }) private playerPanel: WyPlayerPanelComponent;

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
  // 是否显示播放列表面板
  showListPanel = false;
  // 是否点击的是音量面板本身
  selfClick = false;

  private winClick: Subscription;

  // 当前播放的模式
  currentMode: PlayMode;
  // 点击模式图标的次数
  modeCount = 0;

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
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
        // 更新下标
        this.updateCurrentIndex(list, this.currentSong);
        // 修改实际的播放列表
        this.store$.dispatch(SetPlayList({ playList: list }));
      }
      // 注意：由于只在随机模式下更新 playlist，因此当切换过随机模式后，播放的顺序就会一直是随机模式下的顺序
    }
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

  // 更新当前播放歌曲的下标
  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  // 切换模式
  changeMode() {
    this.store$.dispatch(SetPlayMode({ playMode: MODE_PLAY[(++this.modeCount % 3)] }));
  }

  onPercentChange(percent: number) {
    if (this.currentSong) {
      const currentTime = this.duration * (percent / 100)
      this.audio.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
      }
    }
  }

  // 控制音量
  onVolumeChange(volume: number) {
    // audio 的音量值为 0 到 1 之间
    this.audio.volume = volume / 100;
  }

  // 控制音量面板的显示
  toggleVolPanel() {
    this.togglePanel('showVolumePanel');
  }

  // 控制播放列表面板的显示
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showListPanel');
    }
  }
  
  togglePanel(type: string) {
    this[type] = !this[type];
    if (this[type]) {
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
          this.showListPanel = false;
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

  // todos: 上一曲和下一曲需要判断一下播放模式再切换
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

  // 播放结束
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }

  // 单曲循环
  private loop() {
    this.audio.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
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

  // 改变歌曲
  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

}
