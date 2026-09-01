import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'od-dialog',
  template: `
    <div class="od-dialog">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './dialog.scss',
  imports: [],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class Dialog {}
