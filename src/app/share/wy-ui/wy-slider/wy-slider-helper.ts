export function sliderEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
}

export function getElementOffset(el: HTMLElement): { top: number, left: number } {

    // 获取的是一个数组，里面每一项都是 getBoundingClientRect 这样子的成员
    // 也就是说如果这个数组他一条信息都没有，那么表示这个 dom 是有问题的
    if(!el.getClientRects().length) {
        return {
            top: 0,
            left: 0
        };
    }

    const rect = el.getBoundingClientRect();
    // 返回该元素自身的 document 所在的 window 对象
    // ownerDocument 的兼容性如何？
    const win = el.ownerDocument.defaultView;

    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    }
}