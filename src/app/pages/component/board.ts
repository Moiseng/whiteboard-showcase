import { Component, OnDestroy, OnInit } from '@angular/core';
import { ODBoard } from '@odyssea999/whiteboard';

@Component({
  selector: 'od-whiteboard',
  template: ` <div id="id_board"></div> `,
})
export class Board implements OnInit, OnDestroy {
  private odBoard: ODBoard;

  constructor() {
    this.odBoard = new ODBoard('id_board');
  }

  ngOnInit(): void {
    this.odBoard.init();
  }

  ngOnDestroy(): void {
    this.odBoard.destroy();
  }
}
