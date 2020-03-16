/*
 * @Date: 2020-03-16 17:57:54
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 19:03:48
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetDetailComponent } from './sheet-detail.component';
import { SheetDetailResolverService } from './sheet-detail-resolver/sheet-detail-resolver.service';

const routes: Routes = [
    {
        path: 'sheetDetail/:id',
        component: SheetDetailComponent,
        data: { title: '歌单详情' },
        resolve: {
            sheetDetail: SheetDetailResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [SheetDetailResolverService]
})
export class SheetDetailRoutingModule {}
