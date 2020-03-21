/*
 * @Date: 2020-03-16 01:44:46
 * @LastEditors: fashandian
 * @LastEditTime: 2020-03-16 02:27:50
 */
import {
    Directive,
    ElementRef,
    Renderer2,
    Inject,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnChanges {
    @Input() bindFlag = false;
    @Output() clickOutside = new EventEmitter<HTMLElement>();

    private handleClick: () => void; // 参见randerer2的listen方法声明

    constructor(
        private element: ElementRef,
        private renderer2: Renderer2, // 提供 dom 操作的 api
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.bindFlag && !changes.bindFlag.firstChange) {
            if (this.bindFlag) {
                this.handleClick = this.renderer2.listen(
                    this.document,
                    'click',
                    (event: Event) => {
                        const target = event.target;
                        const isContain = this.element.nativeElement.contains(
                            target
                        );
                        if (!isContain) {
                            this.clickOutside.emit(target as HTMLElement);
                        }
                    }
                );
            } else {
                this.handleClick();
            }
        }
    }
}
