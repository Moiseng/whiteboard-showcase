import { Component, OnInit } from '@angular/core';
import { Canvas, CanvasSize, ODBoard } from '@odyssea999/whiteboard';

@Component({
  selector: 'od-whiteboard',
  template: ` <canvas id="id_board"></canvas> `,
})
export class Board implements OnInit {
  private readonly canvsSize: CanvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  private readonly odCanvas: Canvas = Canvas.getInstance();

  private odBoard!: ODBoard;

  constructor() {}

  ngOnInit(): void {
    this.odCanvas.handleCanvasInitialization('id_board', this.canvsSize, 'transparent');
    this.odBoard = new ODBoard(this.odCanvas);

    this.odBoard.init();
  }
}
