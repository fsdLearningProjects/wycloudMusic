/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-06-06 21:42:34
 */
import { Component } from '@angular/core';
import { SearchService } from './services/search/search.service';
import { Search } from './services/data-types/common.types';
import { isEmptyObject } from './utils/tools';
import { ModalType } from './store/reducers/member.reducer';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store/app-store.module';
import { SetModalType } from './store/actions/member.action';
import { MemberBatchActionsService } from './store/batch-actions/member-batch-actions/member-batch-actions.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    title = 'wycloudMusic';
    menu = [
        { label: '发现', path: '/home' },
        { label: '歌单', path: '/sheet' },
    ];
    searchResult: Search;

    constructor(
        private searchService: SearchService,
        private store$: Store<AppStoreModule>,
        private memberBatchActionsService: MemberBatchActionsService
    ) {}

    /** 打开弹窗 */
    openModal(type) {
        this.memberBatchActionsService.controlModal(true, type as ModalType);
    }

    /** 改变弹窗类型 */
    handleChangeModalType(modalType = ModalType.Default) {
        this.store$.dispatch(SetModalType({ modalType }));
    }

    onSearch(keywords: string) {
        if (keywords) {
            this.searchService
                .search(keywords)
                .subscribe(
                    (res) =>
                        (this.searchResult = this.highlightKeywords(
                            keywords,
                            res
                        ))
                );
        } else {
            this.searchResult = {};
        }
    }

    private highlightKeywords(keywords: string, result: Search): Search {
        if (!isEmptyObject(result)) {
            const regExp = new RegExp(keywords, 'ig');
            ['artists', 'songs', 'playlists'].forEach((type) => {
                if (result[type]) {
                    (result[type] as { name: string }[]).forEach((item) => {
                        item.name = item.name.replace(
                            regExp,
                            '<span class="highlight">$&</span>'
                        );
                    });
                }
            });
        }
        return result;
    }
}
