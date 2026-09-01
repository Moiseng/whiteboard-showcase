import {
  ChangeDetectionStrategy,
  Component,
  model,
  ModelSignal,
  ViewEncapsulation,
} from '@angular/core';

type CardColor = {
  hexValue: string;
  colorName: string;
  boxShadowColor: string;
};

@Component({
  selector: 'od-card-picker',
  templateUrl: './card-picker.html',
  styleUrl: './card-picker.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPickerComponent {
  public colors: CardColor[] = [
    {
      hexValue: '#764AB9',
      colorName: 'Violet',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#414154',
      colorName: 'Gray',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#FF0FE3',
      colorName: 'Pink',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#1FDE38',
      colorName: 'Green',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#11CFCF',
      colorName: 'Cyan',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#2222D6',
      colorName: 'Blue',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#318183',
      colorName: 'dark cyan',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
    {
      hexValue: '#CBC01D',
      colorName: 'dark cyan',
      boxShadowColor: 'rgba(118, 74, 185, 0.25)',
    },
  ];

  selectedColor: ModelSignal<string | undefined> = model<string>();

  constructor() {}

  setSelectedColor(value: string): void {
    this.selectedColor.set(value);
  }
}
