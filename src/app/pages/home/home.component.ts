/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 18:23:01
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    Banner,
    HotTag,
    SongSheet,
    Singer,
} from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { PlayerBatchActionsService } from 'src/app/store/batch-actions/player-batch-actions/player-batch-actions.service';
import { MemberBatchActionsService } from 'src/app/store/batch-actions/member-batch-actions/member-batch-actions.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
    @ViewChild(NzCarouselComponent, { static: true })
    private nzCarousel: NzCarouselComponent;

    carouselActiveIndex = 0;
    banners: Banner[];
    hotTags: HotTag[];
    songSheetList: SongSheet[];
    singers: Singer[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sheetService: SheetService,
        private playerBatchActionsService: PlayerBatchActionsService,
        private memberBatchActionsService: MemberBatchActionsService
    ) {
        this.route.data
            .pipe(map((res) => res.homeDatas))
            .subscribe(([banners, hotTags, songSheetList, singers]) => {
                this.banners = banners;
                this.hotTags = hotTags;
                this.songSheetList = songSheetList;
                this.singers = singers;
            });
    }

    ngOnInit(): void {}

    onBeforeChange({ to }: { to: number }): void {
        this.carouselActiveIndex = to;
    }

    onChangeSlide(type: 'pre' | 'next'): void {
        this.nzCarousel[type]();
    }

    onPlaySheet(id: number): void {
        this.sheetService.playSheet(id).subscribe((res) => {
            this.playerBatchActionsService.selectPlayList({ res, index: 0 });
        });
    }

    goDetail(id: number) {
        this.router.navigate(['/sheetDetail', id]);
    }

    // 打开弹窗
    openModal() {
        this.memberBatchActionsService.controlModal();
    }
}
