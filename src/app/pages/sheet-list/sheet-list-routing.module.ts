/*
 * @Date: 2020-03-16 16:02:32
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 16:05:33
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetListComponent } from './sheet-list.component';

const routes: Routes = [
    {
        path: 'sheet',
        component: SheetListComponent,
        data: { title: '歌单列表' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SheetListRoutingModule {}
