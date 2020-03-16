/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 17:58:35
 */
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { SheetDetailModule } from './sheet-detail/sheet-detail.module';

@NgModule({
    declarations: [],
    imports: [HomeModule, SheetListModule, SheetDetailModule],
    exports: [HomeModule, SheetListModule, SheetDetailModule]
})
export class PagesModule {}
