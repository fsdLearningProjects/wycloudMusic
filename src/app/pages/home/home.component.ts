import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store/app-store.module';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { shuffle, findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];

  private playState: PlayState;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    });

    this.store$.pipe(select(createFeatureSelector<PlayState>('player'))).subscribe(res => this.playState = res);
  }

  ngOnInit(): void {
  }

  onBeforeChange({ to }: { to: number }): void {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next'): void {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number): void {
    this.sheetService.playSheet(id).subscribe(res => {
      this.store$.dispatch(SetSongList({ songList: res }));

      let playIndex = 0;
      // 避免引用问题
      let playList = res.slice();

      if (this.playState.playMode.type === 'random' && res) {
        playList = shuffle(res);
        playIndex = findIndex(playList, playList[playIndex]);
      }

      this.store$.dispatch(SetPlayList({ playList: playList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: playIndex }));
    })
  }

}
