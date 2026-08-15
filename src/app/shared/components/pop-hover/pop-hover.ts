import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnChanges,
  signal,
  SimpleChanges,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { Maybe, Nullable } from '@odyssea999/whiteboard';

type Position = 'relative' | 'absolute' | 'fixed' | 'sticky' | 'unset';

@Component({
  selector: 'od-pop-hover',
  templateUrl: './pop-hover.html',
  styleUrl: './pop-hover.scss',
  imports: [],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pop-hover',
  },
})
export class PopHoverComponent implements AfterContentInit, OnChanges {
  /**
   * Id or Class of the element to listen to
   * When clicked, then we display the component
   */
  listenTo: InputSignal<string> = input.required();
  /**
   * When triggered, if set to TRUE
   * Then, the Pop over dialog will close
   *
   * This is necessary, because if you want to close
   * after a specific click inside the Pop over dialog
   */
  close: InputSignal<boolean> = input(false);
  /**
   * Set background color of the pop over element
   */
  backgroundColor: InputSignal<Maybe<string>> = input();
  /**
   * Set height of the Pop over element
   */
  height: InputSignal<Maybe<string>> = input();
  /**
   * Set bow shadow
   */
  shadow: InputSignal<Maybe<string>> = input();
  /**
   * Add border radius to the Element
   */
  borderRadius: InputSignal<Maybe<string>> = input();
  /**
   * Element width
   */
  width: InputSignal<string> = input.required();
  /**
   * Set position to the element
   */
  position: InputSignal<Position> = input.required();
  /**
   * To be specified if user uses Position " absolute " or " Relative " or " Fixed "
   */
  top: InputSignal<Maybe<string>> = input();
  /**
   * To be specified if user uses Position " absolute " or " Relative " or " Fixed "
   */
  bottom: InputSignal<Maybe<string>> = input();
  /**
   * To be specified if user uses Position " absolute " or " Relative " or " Fixed "
   */
  right: InputSignal<Maybe<string>> = input();
  /**
   * To be specified if user uses Position " absolute " or " Relative " or " Fixed "
   */
  left: InputSignal<Maybe<string>> = input();
  /**
   * To be used for specific cases
   * For example, if you don't want to show the component content
   * When the ' listenToCClick ' method is triggered, but you want to handle
   * The click event on another component side
   * Then, when the click event is triggered, you should pass a boolean value here
   * This way, the content will be displayed or hide based on the passed value
   */
  isVisible: ModelSignal<boolean> = model(false);
  /**
   * Set z-index to the element
   */
  zIndex: InputSignal<Maybe<number>> = input();
  /**
   * Simple variable to show or hide current dialog content
   * This doesn't remove the component in the DOM
   */
  show: WritableSignal<boolean> = signal<boolean>(false);

  private positionDefined: Maybe<string>;

  constructor(private readonly ref: ElementRef) {}

  ngAfterContentInit(): void {
    this.listenToCClick();
    this.handleStyles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] !== undefined) {
      this.showOnIsVisible(changes['isVisible']['currentValue']);
    }
  }

  private listenToCClick(): void {
    const element: Nullable<HTMLElement> = this.findElementByClassOrId(this.listenTo());

    if (element !== null) {
      element.addEventListener('click', (event): void => {
        event.preventDefault();

        this.show.set(!this.show());
      });
    }
  }

  private showOnIsVisible(value: boolean): void {
    this.show.set(value);
  }

  private findElementByClassOrId(classOrId: string): Nullable<HTMLElement> {
    let element: Nullable<HTMLElement> = null;

    const byIdElement: Nullable<HTMLElement> = document.getElementById(classOrId);

    if (byIdElement !== null) {
      element = byIdElement;
    } else {
      const byClassElement: Nullable<HTMLElement> = document.querySelector(`.${classOrId}`);

      if (byClassElement !== null) {
        element = byClassElement;
      }
    }

    return element;
  }

  private handleStyles(): void {
    this.setWidth();
    this.setPosition();
    this.setBackgroundColor();
    this.setHeight();
    this.setBoxShadow();
    this.setBorderRadius();
    this.setZIndex();
  }

  private setBackgroundColor(): void {
    const background: Maybe<string> = this.backgroundColor();
    if (background !== undefined && background !== '') {
      this.ref.nativeElement.style.setProperty('--pop-hover-background', background);
    }
  }

  private setHeight(): void {
    const height: Maybe<string> = this.height();
    if (height !== undefined && height !== '') {
      this.ref.nativeElement.style.setProperty('--pop-hover-height', height);
    }
  }

  private setBoxShadow(): void {
    const boxShadow: Maybe<string> = this.shadow();
    if (boxShadow !== undefined && boxShadow !== '') {
      this.ref.nativeElement.style.setProperty('--pop-hover-box-shadow', boxShadow);
    }
  }

  private setBorderRadius(): void {
    const radius: Maybe<string> = this.borderRadius();
    if (radius !== undefined && radius !== '') {
      this.ref.nativeElement.style.setProperty('--pop-hover-border-radius', radius);
    }
  }

  private setWidth(): void {
    const width: string = this.width();

    if (width !== undefined && width !== '') {
      this.ref.nativeElement.style.width = width;
    }
  }

  private setZIndex(): void {
    const zIndex: Maybe<number> = this.zIndex();

    if (zIndex !== undefined) {
      this.ref.nativeElement.style.zIndex = zIndex;
    }
  }

  private setPosition(): void {
    const position: Position = this.position();

    if (position !== undefined) {
      this.positionDefined = position;
      this.ref.nativeElement.style.position = position;

      this.setTop();
      this.setBottom();
      this.setRight();
      this.setLeft();
    }
  }

  private setTop(): void {
    const top: Maybe<string> = this.top();

    if (
      this.positionDefined === 'absolute' ||
      this.positionDefined === 'relative' ||
      this.positionDefined === 'fixed'
    ) {
      if (top !== undefined && top !== '') {
        this.ref.nativeElement.style.top = top;
      } else {
        throw new Error(
          `You need to specify Top parameter value when position : ${this.positionDefined} is defined`,
        );
      }
    }
  }

  private setBottom(): void {
    const bottom: Maybe<string> = this.bottom();

    if (
      this.positionDefined === 'absolute' ||
      this.positionDefined === 'relative' ||
      this.positionDefined === 'fixed'
    ) {
      if (bottom !== undefined && bottom !== '') {
        this.ref.nativeElement.style.bottom = bottom;
      } else {
        throw new Error(
          `You need to specify Bottom parameter value when position : ${this.positionDefined} is defined`,
        );
      }
    }
  }

  private setLeft(): void {
    const left: Maybe<string> = this.left();

    if (
      this.positionDefined === 'absolute' ||
      this.positionDefined === 'relative' ||
      this.positionDefined === 'fixed'
    ) {
      if (left !== undefined && left !== '') {
        this.ref.nativeElement.style.left = left;
      } else {
        throw new Error(
          `You need to specify Left parameter value when position : ${this.positionDefined} is defined`,
        );
      }
    }
  }

  private setRight(): void {
    const right: Maybe<string> = this.right();

    if (
      this.positionDefined === 'absolute' ||
      this.positionDefined === 'relative' ||
      this.positionDefined === 'fixed'
    ) {
      if (right !== undefined && right !== '') {
        this.ref.nativeElement.style.right = right;
      } else {
        throw new Error(
          `You need to specify Right parameter value when position : ${this.positionDefined} is defined`,
        );
      }
    }
  }
}
