import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number): string {
    if (time) {
      // (x | 0) 相当于向下取整
      const temp = time | 0;
      const minutes = (temp / 60 | 0).toString().padStart(2, '0');
      const seconds = (temp % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    } else {
      return '00:00';
    }
  }

}
