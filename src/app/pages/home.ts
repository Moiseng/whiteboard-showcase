import { Component } from '@angular/core';
import { Board } from './component/board';
import { SvgComponent } from '../shared/components/svg/svg';
import { ActionRegistryHandler, effect as WBEffect, Zoom } from '@odyssea999/whiteboard';
import { BoardZoomPipe } from './pipe/board-zoom';
import { PopHoverComponent } from '../shared/components/pop-hover/pop-hover';
import { CardPickerComponent } from './component/card-picker/card-picker';
import { cardColor } from './component/board.signal';
import { Maybe } from '../shared/type';
import { Dialog } from '../shared/components/dialog/dialog';

@Component({
  selector: 'od-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Board, SvgComponent, Dialog, BoardZoomPipe, PopHoverComponent, CardPickerComponent],
})
export class Home {
  public zoomValue: number = 1;
  private readonly _actionHandler: ActionRegistryHandler = ActionRegistryHandler.getInstance();
  private readonly zoom = Zoom.getInstance();

  constructor() {
    WBEffect((): void => {
      this.zoomValue = this.zoom.$zoomValue.value;
    });
  }

  zoomIn(event: MouseEvent): void {
    this._actionHandler.setWithParams('zoomInAction', {
      props: { zoom_in: this.zoomValue },
    });
    this._actionHandler.execute();
  }

  zoomOut(event: MouseEvent): void {
    this._actionHandler.setWithParams('zoomOutAction', {
      props: { zoom_out: this.zoomValue },
    });
    this._actionHandler.execute();
  }

  undo(): void {
    this._actionHandler.setAction('undoAction');
    this._actionHandler.execute();
  }

  redo(): void {
    this._actionHandler.setAction('redoAction');
    this._actionHandler.execute();
  }

  setBoardAction(action: string): void {
    this._actionHandler.setAction(action);
  }

  setTextAction(): void {
    this._actionHandler.setAction('createText');
  }

  setCardColor(value: Maybe<string>): void {
    if (value !== undefined) {
      this.setBoardAction('createCard');
      cardColor.set(value);
    }
  }
}
