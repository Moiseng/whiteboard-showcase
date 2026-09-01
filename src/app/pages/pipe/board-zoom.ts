import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boardZoomPercent',
  standalone: true,
})
export class BoardZoomPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('en-GB', { style: 'percent' }).format(value);
  }
}
