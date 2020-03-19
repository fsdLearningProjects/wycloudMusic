/*
 * @Date: 2020-03-19 18:38:49
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-19 19:01:28
 */
import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-wy-search',
    templateUrl: './wy-search.component.html',
    styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit {
    @Input() customView: TemplateRef<any>;

    // 向外部组件暴露出去的值。可以放这里面
    myContext = {};

    constructor() {}

    ngOnInit(): void {}
}
