import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Board } from './component/board';
import { SvgComponent } from '../shared/components/svg/svg';
import {
  BoardContext,
  IEventMap,
  IEventSubscription,
  Nullable,
  shapeBuilder,
  subscribe,
  effect as WBEffect,
} from '@odyssea999/whiteboard';
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
export class Home implements OnInit, AfterContentChecked, OnDestroy {
  public zoomValue: number = 1;
  private _boardContext: Nullable<BoardContext> = null;
  private _subscription: Nullable<IEventSubscription> = null;

  constructor() {
    WBEffect(() => {
      if (this._boardContext) {
        this.zoomValue = this._boardContext.boardUIStore.$scale.value;
        console.log('zoomValue :: ', this.zoomValue);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  ngAfterContentChecked(): void {
    this._subscription = subscribe<IEventMap, 'boardContext:created'>(
      'boardContext:created',
      (event): void => {
        this._boardContext = event.payload.context;
      },
      'core:global.eventBus',
    );
  }

  zoomIn(event: MouseEvent): void {
    if (this._boardContext) {
      this._boardContext?.actionManager.execute(this._boardContext, 'core:action.zoomInAction', {
        scope: 'local',
        data: {
          zoom_in: this._boardContext.boardUIStore.$scale.value,
        },
      });
    }
  }

  zoomOut(event: MouseEvent): void {
    if (this._boardContext) {
      this._boardContext?.actionManager.execute(this._boardContext, 'core:action.zoomOutAction', {
        scope: 'local',
        data: {
          zoom_out: this._boardContext.boardUIStore.$scale.value,
        },
      });
    }
  }

  undo(): void {
    if (this._boardContext) {
      this._boardContext.actionManager.execute(this._boardContext, 'core:action.undoAction', {
        scope: 'local',
      });
    }
  }

  redo(): void {
    if (this._boardContext) {
      this._boardContext.actionManager.execute(this._boardContext, 'core:action.redoAction', {
        scope: 'local',
      });
    }
  }

  setBoardAction(action: string): void {}

  setTextAction(): void {
    if (this._boardContext) {
      this._boardContext.actionManager.prepare(this._boardContext, 'core:shape.createText', {
        scope: 'local',
      });
    }
  }

  setCardColor(value: Maybe<string>): void {
    if (value !== undefined) {
      /*    this._actionHandler.setWithParams('createCard', {
        props: shapeBuilder('Card', value),
      });
      cardColor.set(value);*/
    }
  }

  setFrameAction(): void {
    /*this._actionHandler.setWithParams('createFrame', {
      props: shapeBuilder('Frame'),
    });*/
  }
}
