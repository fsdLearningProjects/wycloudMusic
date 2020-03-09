import { Lyric } from "src/app/services/data-types/common.types";
import { zip, from, Observable } from 'rxjs';
import { skip } from 'rxjs/internal/operators';

// [00:30:990] 分:秒.毫秒
const timeExp: RegExp = /\[(\d+):(\d+).(\d+)\]/

export interface LyricLine {
    lyric: string;
    tlyric: string;
}

export interface lyricAndTimeLine extends LyricLine {
    time: number;
}

export class WyLyric {
    
    private lrc: Lyric;

    lines: lyricAndTimeLine[] = [];

    constructor(lyric: Lyric) {
        this.lrc = lyric;
        this.init();
    }

    private init() {
        if (this.lrc.tlyric) {
            this.generateTLyric();
        } else {
            this.generateLyric();
        }
    }

    private generateLyric() {
        const lines = this.lrc.lyric.split('\n');
        lines.forEach(line => this.makeLine(line));
    }

    private generateTLyric() {
        const lines = this.lrc.lyric.split('\n');
        const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.test(item));
        const moreLineLength = lines.length - tlines.length;
        let temp = [];

        if (moreLineLength >= 0) {
            temp = [lines, tlines];
        } else {
            temp = [tlines, lines];
        }

        const firstLyricTime = timeExp.exec(temp[1][0])[0];
        const skipIndex = temp[0].findIndex(item => {
            const exec = timeExp.exec(item);
            if (exec) {
                return exec[0] === firstLyricTime;
            }
        });

        const _skip = skipIndex === -1 ? 0 : skipIndex;
        const skipItems = temp[0].slice(0, _skip);

        if (skipItems.length) {
            skipItems.forEach(line => this.makeLine(line));
        }

        let zipLines$: Observable<string[]>;
        
        if (moreLineLength >= 0) {
            zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
        } else {
            zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
        }

        zipLines$.subscribe(([line, tline]) => this.makeLine(line, tline));
    }

    private makeLine(line: string, tline = '') {
        const result = timeExp.exec(line);
        if (result) {
            const lyric = line.replace(timeExp, '').trim();
            const tlyric = tline ? line.replace(timeExp, '').trim() : '';
            if (lyric) {
                const millisecond = +(result[3] || '0');
                const time = (+result[1] * 60 * 1000) + (+result[2] * 1000) + millisecond;
                this.lines.push({ lyric, tlyric, time });
            }
        }
    }
}