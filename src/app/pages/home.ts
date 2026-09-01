import { Component } from '@angular/core';
import { Board } from './component/board';
import { SvgComponent } from '../shared/components/svg/svg';
import { ActionRegistryHandler } from '@odyssea999/whiteboard';
import { BoardZoomPipe } from './pipe/board-zoom';
import { PopHoverComponent } from '../shared/components/pop-hover/pop-hover';
import { CardPickerComponent } from './component/card-picker/card-picker';
import { cardColor } from './component/board.signal';
import { Maybe } from '../shared/type';

@Component({
  selector: 'od-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Board, SvgComponent, BoardZoomPipe, PopHoverComponent, CardPickerComponent],
})
export class Home {
  public zoomValue: number = 1;
  private readonly _actionHandler: ActionRegistryHandler = ActionRegistryHandler.getInstance();

  zoomIn(event: MouseEvent): void {
    this._actionHandler.setAction('zoomInAction');
    this._actionHandler.execute({
      event: event,
      props: { zoom_in: this.zoomValue },
    });
  }

  zoomOut(event: MouseEvent): void {
    this._actionHandler.setAction('zoomOutAction');
    this._actionHandler.execute({
      event: event,
      props: { zoom_out: this.zoomValue },
    });
  }

  setBoardAction(action: string): void {
    this._actionHandler.setAction(action);
  }

  setTextAction(): void {
    this._actionHandler.setAction('createTextAction');
  }

  setCardColor(value: Maybe<string>): void {
    if (value !== undefined) {
      this.setBoardAction('createCard');
      cardColor.set(value);
    }
  }
}
