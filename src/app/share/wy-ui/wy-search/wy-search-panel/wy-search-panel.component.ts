/*
 * @Date: 2020-03-20 02:17:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-20 04:57:59
 */
import {
    Component,
    OnInit,
    ViewChild,
    Inject,
    forwardRef,
    Output,
    EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { Search } from 'src/app/services/data-types/common.types';

@Component({
    selector: 'app-wy-search-panel',
    templateUrl: './wy-search-panel.component.html',
    styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
    @Output() goPageEmitter = new EventEmitter<void>();

    searchResult: Search;

    // 在 constructor 中注入父组件的实例，然后就可以操作父组件的属性以及方法，达到组件通信的效果
    // 但不能同时在父、子组件中引入子、父组件，会报循环依赖的警告
    // @Inject(forwardRef(() => WySearchComponent)) private wySearchComponent: WySearchComponent
    // this.wySearchComponent.hideOverlayPanel();
    constructor(private router: Router) {}

    ngOnInit(): void {}

    goPage(path: [string, number]) {
        this.router.navigate(path);
        this.goPageEmitter.emit();
    }
}
