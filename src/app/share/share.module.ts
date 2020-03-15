/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 01:48:01
 */
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
import { WyUiModule } from './wy-ui/wy-ui.module';

registerLocaleData(zh);

@NgModule({
    imports: [CommonModule, FormsModule, NgZorroAntdModule, WyUiModule],
    exports: [CommonModule, FormsModule, NgZorroAntdModule, WyUiModule],
    providers: [{ provide: NZ_I18N, useValue: zh_CN }]
})
export class ShareModule {}
