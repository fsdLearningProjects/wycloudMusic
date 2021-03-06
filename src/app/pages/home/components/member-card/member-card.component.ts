/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 18:21:10
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.less'],
})
export class MemberCardComponent implements OnInit {
    @Output() openModal = new EventEmitter<void>();

    constructor() {}

    ngOnInit(): void {}
}
