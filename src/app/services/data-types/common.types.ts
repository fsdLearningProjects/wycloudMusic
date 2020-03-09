export type Banner = {
    targetId: number;
    url: string;
    imageUrl: string;
};

export type HotTag = {
    id: number;
    name: string;
    position: number;
};

// 貌似推荐用 interface 来代替 type
export interface Singer {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
};

// 歌曲
export interface Song {
    id: number;
    name: string;
    url: string;
    ar: Singer[];
    al: {
        id: number;
        name: string;
        picUrl: string;
    };
    dt: number;
}

// 播放地址
export interface SongUrl {
    id: number;
    url: string;
}

// 歌单
export interface SongSheet {
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    tracks: Song[];
};

// 歌词
export interface Lyric {
    lyric: string;
    tlyric: string;
}