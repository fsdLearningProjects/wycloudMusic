/*
 * @Date: 2020-03-19 18:37:28
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-19 19:00:42
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';

@NgModule({
    declarations: [WySearchComponent],
    imports: [CommonModule, NzIconModule, NzInputModule],
    exports: [WySearchComponent]
})
export class WySearchModule {}
