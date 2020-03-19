/*
 * @Date: 2020-03-19 18:37:28
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-20 03:02:51
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
// @angular/cdk 来自 Material，需要安装
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
    declarations: [WySearchComponent, WySearchPanelComponent],
    // 动态组件需要在 entryComponents 中声明
    entryComponents: [WySearchPanelComponent],
    imports: [CommonModule, NzIconModule, NzInputModule, OverlayModule],
    exports: [WySearchComponent]
})
export class WySearchModule {}
