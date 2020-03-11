import { Lyric } from "src/app/services/data-types/common.types";
import { zip, from, Observable, Subject, Subscription, timer } from 'rxjs';
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

export interface Handler extends LyricLine {
    lineIndex: number; // 当前这行歌词的索引
}

export class WyLyric {
    
    private lrc: Lyric;
    private playing = false;
    // 当前播放第几行歌词
    private currentLyricNum = 0;
    private startStamp = 0;
    private timer$: Subscription;
    private pauseStamp: number;

    lines: lyricAndTimeLine[] = [];
    handlerSubject = new Subject<Handler>();

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

    // todos: 这个方法需要优化一下
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
            const tlyric = tline ? tline.replace(timeExp, '').trim() : '';
            if (lyric) {
                const millisecond = +(result[3] || '0');
                const time = (+result[1] * 60 * 1000) + (+result[2] * 1000) + millisecond;
                this.lines.push({ lyric, tlyric, time });
            }
        }
    }

    togglePlay(playing: boolean) {
        const now = Date.now();
        this.playing = playing;
        if (this.playing) {
            const startTime = (this.pauseStamp || now) - (this.startStamp || now);
            this.play(startTime, true);
        } else {
            this.stop();
            this.pauseStamp = now;
        }
    }

    stop() {
        if (this.playing) {
            this.playing = false;
        }
        this.clearTimer();
    }
    
    seek(time: number) {
        this.play(time);
    }

    play(startTime = 0, skip = false) {
        if (!this.lines.length) {
            return;
        }

        if (!this.playing) {
            this.playing = true;
        }

        this.currentLyricNum = this.findCurrentLyricNum(startTime);

        this.startStamp = Date.now() - startTime;

        if (!skip) {
            this.callHandler(this.currentLyricNum - 1);
        }

        if (this.currentLyricNum < this.lines.length) {
            this.clearTimer();
            this.playContinue();
        }

    }

    private playContinue() {
        let line = this.lines[this.currentLyricNum];
        const delay = line.time - (Date.now() - this.startStamp);
        this.timer$ = timer(delay).subscribe(() => {
            this.callHandler(this.currentLyricNum++);
            if (this.currentLyricNum < this.lines.length && this.playing) {
                this.playContinue();
            }
        })
    }

    private clearTimer() {
        this.timer$ && this.timer$.unsubscribe();
    }

    // 发射当前行歌词的索引
    private callHandler(index: number) {
        if (index > 0) {
            this.handlerSubject.next({
                lyric: this.lines[index].lyric,
                tlyric: this.lines[index].tlyric,
                lineIndex: index
            });
        }
    }

    private findCurrentLyricNum(time: number): number {
        const index = this.lines.findIndex(item => time <= item.time);
        return index === -1 ? this.lines.length - 1 : index;
    }
}