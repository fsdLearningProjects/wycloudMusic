/*
 * @Date: 2020-03-18 16:54:24
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 17:16:37
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { SingerResolverService } from './singer-resolver/singer-resolver.service';

const routes: Routes = [
    {
        path: 'singer/:id',
        component: SingerDetailComponent,
        data: { title: '歌手详情' },
        resolve: {
            singerDetail: SingerResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [SingerResolverService]
})
export class SingerRoutingModule {}
