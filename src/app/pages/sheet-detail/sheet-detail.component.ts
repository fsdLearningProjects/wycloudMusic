/*
 * @Date: 2020-03-16 17:58:56
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-17 02:40:58
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SheetDetailResolverService } from './sheet-detail-resolver/sheet-detail-resolver.service';
import { map } from 'rxjs/internal/operators';
import { SongSheet } from 'src/app/services/data-types/common.types';

@Component({
    selector: 'app-sheet-detail',
    templateUrl: './sheet-detail.component.html',
    styleUrls: ['./sheet-detail.component.less']
})
export class SheetDetailComponent implements OnInit {
    sheetDetail: SongSheet;
    description = {
        short: '',
        long: ''
    };
    controlDesc = {
        isExpand: false,
        label: '展开',
        iconClass: 'down'
    };

    constructor(private route: ActivatedRoute) {
        this.route.data.pipe(map(res => res.sheetDetail)).subscribe(res => {
            this.sheetDetail = res;
            if (res.description) {
                this.changeDesc(res.description);
            }
        });
    }

    ngOnInit(): void {}

    toggleDesc() {
        this.controlDesc.isExpand = !this.controlDesc.isExpand;
        if (this.controlDesc.isExpand) {
            this.controlDesc.label = '收起';
            this.controlDesc.iconClass = 'up';
        } else {
            this.controlDesc.label = '展开';
            this.controlDesc.iconClass = 'down';
        }
    }

    private changeDesc(desc: string) {
        if (desc.length < 99) {
            this.description.short = this.replaceBr('<b>介绍：</b>' + desc);
            this.description.long = '';
        } else {
            this.description.short =
                this.replaceBr('<b>介绍：</b>' + desc.slice(0, 99)) + '...';
            this.description.long = this.replaceBr('<b>介绍：</b>' + desc);
        }
    }

    private replaceBr(desc: string) {
        return desc.replace(/\n/g, '<br />');
    }
}
