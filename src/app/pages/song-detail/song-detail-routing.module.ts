/*
 * @Date: 2020-03-18 02:46:14
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-18 03:03:33
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongDetailComponent } from './song-detail.component';
import { SongDetailResolverService } from './song-detail-resolver/song-detail-resolver.service';

const routes: Routes = [
    {
        path: 'songDetail/:id',
        component: SongDetailComponent,
        data: { title: '歌曲详情' },
        resolve: {
            songDetail: SongDetailResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [SongDetailResolverService]
})
export class SongDetailRoutingModule {}
