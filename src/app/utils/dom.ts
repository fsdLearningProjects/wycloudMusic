/*
 * @Date: 2020-05-30 17:30:25
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-30 21:47:09
 */
const getWindowSize = () => {
    return {
        width:
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.offsetWidth,
        height:
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.offsetHeight,
    };
};

const layoutCenter = (dom: HTMLElement) => {
    const left = (getWindowSize().width - dom.offsetWidth) / 2;
    const top = (getWindowSize().height - dom.offsetHeight) / 2;

    dom.style.left = left + 'px';
    dom.style.top = top + 'px';
};

export { layoutCenter };
