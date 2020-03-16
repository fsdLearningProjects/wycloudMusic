/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 17:55:25
 */
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'wycloudMusic';
    menu = [
        { label: '发现', path: '/home' },
        { label: '歌单', path: '/sheet' }
    ];
}
