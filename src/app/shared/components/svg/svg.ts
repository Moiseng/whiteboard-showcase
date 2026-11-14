import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  InputSignal,
  ViewEncapsulation,
} from '@angular/core';
import { SvgService } from './service/svg.service';
import { Maybe } from '@odyssea999/whiteboard';

@Component({
  selector: 'od-svg',
  imports: [],
  providers: [SvgService],
  templateUrl: './svg.html',
  styleUrl: './svg.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  host: {
    class: 'od-svg',
  },
})
export class SvgComponent implements AfterContentInit {
  /**
   * SVG file path
   */
  path: InputSignal<string> = input<string>('');
  /**
   * SVG width
   */
  width: InputSignal<string> = input<string>('25px');
  /**
   * SVG height
   */
  height: InputSignal<string> = input<string>('25px');
  fill: InputSignal<string> = input<string>('');
  stroke: InputSignal<string> = input<string>('');

  constructor(
    private readonly ref: ElementRef,
    private readonly svgService: SvgService,
  ) {}

  ngAfterContentInit() {
    this.init();
  }

  init(): void {
    const svgFilePath: string | undefined = this.path();
    const width: string | undefined = this.width();
    const height: string | undefined = this.height();
    const fill: Maybe<string> = this.fill();
    const stroke: Maybe<string> = this.stroke();

    if (svgFilePath !== undefined) {
      this.svgService.handleSvgFile(svgFilePath, this.ref).finally(() => {
        this.getSVGAfterInit(height, width, fill, stroke);
      });
    }
  }

  getSVGAfterInit(
    height: Maybe<string>,
    width: Maybe<string>,
    fill: Maybe<string>,
    stroke: Maybe<string>,
  ): void {
    const svg: Maybe<SVGElement> = this.ref.nativeElement.querySelector('svg');

    if (svg !== undefined) {
      if (height !== undefined) {
        svg.style.height = height;
      }

      if (width !== undefined) {
        svg.style.width = width;
      }

      this.applyStyleToSVGChildElements(svg, fill, stroke);
    }
  }

  private applyStyleToSVGChildElements(
    svg: SVGElement,
    fill: Maybe<string>,
    stroke: Maybe<string>,
  ): void {
    const children = svg.querySelectorAll('path');

    for (const path of children) {
      if (fill) {
        path.style.fill = fill;
      }

      if (stroke) {
        path.style.stroke = stroke;
      }
    }
  }
}
