/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 16:52:14
 */
import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    Output,
    EventEmitter
} from '@angular/core';
import { SongSheet } from 'src/app/services/data-types/common.types';

@Component({
    selector: 'app-single-sheet',
    templateUrl: './single-sheet.component.html',
    styleUrls: ['./single-sheet.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
    @Input() sheet: SongSheet;
    @Output() onPlay = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}

    playSheet(id: number): void {
        this.onPlay.emit(id);
    }

    get imgUrl() {
        return this.sheet.picUrl || this.sheet.coverImgUrl;
    }
}
