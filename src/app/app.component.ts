/*
 * @Date: 2020-03-13 19:46:21
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-20 05:13:39
 */
import { Component } from '@angular/core';
import { SearchService } from './services/search/search.service';
import { Search } from './services/data-types/common.types';
import { isEmptyObject } from './utils/tools';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'wycloudMusic';
    menu = [
        { label: '发现', path: '/home' },
        { label: '歌单', path: '/sheet' }
    ];
    searchResult: Search;

    constructor(private searchService: SearchService) {}

    onSearch(keywords: string) {
        if (keywords) {
            this.searchService
                .search(keywords)
                .subscribe(
                    res =>
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
            ['artists', 'songs', 'playlists'].forEach(type => {
                if (result[type]) {
                    (result[type] as { name: string }[]).forEach(item => {
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
