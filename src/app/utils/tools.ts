/*
 * @Date: 2020-03-20 02:22:35
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-20 02:22:37
 */
export function isEmptyObject(obj: object): boolean {
    return JSON.stringify(obj) === '{}';
}