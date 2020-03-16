export interface Banner {
    targetId: number;
    url: string;
    imageUrl: string;
}

export interface HotTag {
    id: number;
    name: string;
    position: number;
}

// 貌似推荐用 interface 来代替 type
export interface Singer {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
}

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
    userId: number;
    name: string;
    picUrl: string;
    coverImgUrl: string;
    playCount: number;
    /** 标签 */
    tags: string[];
    createTime: number;
    creator: {
        /** 创作人名称 */
        nickname: string;
        /** 头像 */
        avatarUrl: string;
    };
    /** 描述信息 */
    description: string;
    /** 订阅数 */
    subscribedCount: number;
    /** 分享数 */
    shareCount: number;
    /** 评论数 */
    commentCount: number;
    /** 当前用户是否订阅了该歌单 */
    subscribed: boolean;
    tracks: Song[];
}

// 歌词
export interface Lyric {
    lyric: string;
    tlyric: string;
}

// 歌单列表
export interface SheetList {
    playlists: SongSheet[];
    total: number;
}
