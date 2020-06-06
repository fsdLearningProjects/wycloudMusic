/*
 * @Date: 2020-05-23 16:37:30
 * @LastEditors: fashandian
 * @LastEditTime: 2020-06-06 20:19:53
 */
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Output,
    EventEmitter,
} from '@angular/core';

@Component({
    selector: 'app-wy-layer-default',
    templateUrl: './wy-layer-default.component.html',
    styleUrls: ['./wy-layer-default.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerDefaultComponent implements OnInit {
    @Output() handleChangeModalType = new EventEmitter<string | void>();

    constructor() {}

    ngOnInit(): void {}
}
