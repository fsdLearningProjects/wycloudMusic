/*
 * @Date: 2020-03-16 16:03:23
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 18:06:55
 */
import { Component, OnInit } from '@angular/core';
import {
    SheetParams,
    SheetService,
} from 'src/app/services/sheet/sheet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetList } from 'src/app/services/data-types/common.types';
import { PlayerBatchActionsService } from 'src/app/store/batch-actions/player-batch-actions/player-batch-actions.service';

@Component({
    selector: 'app-sheet-list',
    templateUrl: './sheet-list.component.html',
    styleUrls: ['./sheet-list.component.less'],
})
export class SheetListComponent implements OnInit {
    listParams: SheetParams = {
        offset: 1,
        limit: 35,
        order: 'hot',
        cat: '全部',
    };
    sheets: SheetList;
    orderValue = 'hot';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sheetService: SheetService,
        private playerBatchActionsService: PlayerBatchActionsService
    ) {
        this.listParams.cat =
            this.route.snapshot.queryParamMap.get('cat') || '全部';
        this.getList();
    }

    ngOnInit(): void {}

    onOrderChange(order: 'new' | 'hot') {
        this.listParams.order = order;
        this.listParams.offset = 1;
        this.getList();
    }

    onPlaySheet(id: number) {
        this.sheetService.playSheet(id).subscribe((res) => {
            this.playerBatchActionsService.selectPlayList({ res, index: 0 });
        });
    }

    goDetail(id: number) {
        this.router.navigate(['/sheetDetail', id]);
    }

    onPageChange(page: number) {
        this.listParams.offset = page;
        this.getList();
    }

    private getList() {
        this.sheetService
            .getSheets(this.listParams)
            .subscribe((res) => (this.sheets = res));
    }
}
