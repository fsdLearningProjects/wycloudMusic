import { getRandomInt } from './number';

export function shuffle<T>(arr: T[]): T[] {
    const result = arr.slice();
    for (let i = 0; i < result.length; i++) {
        // 获取 0 到 i 之间的一个随机数
        const j = getRandomInt([0, i]);
        // 交换两个数
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}