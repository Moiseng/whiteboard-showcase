import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  InputSignal,
  ViewEncapsulation
} from '@angular/core';
import {SvgService} from "./service/svg.service";

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
    "class": "od-svg"
  }
})
export class SvgComponent implements AfterContentInit{

  /**
   * SVG file path
   */
  path: InputSignal<string> = input<string>("");
  /**
   * SVG width
   */
  width: InputSignal<string> = input<string>("");
  /**
   * SVG height
   */
  height: InputSignal<string> = input<string>("");

  constructor(private readonly ref: ElementRef, private readonly svgService: SvgService) {}

  ngAfterContentInit() {
    this.init();
  }

  init(): void {
    const svgFilePath: string | undefined = this.path();
    const width: string | undefined = this.width();
    const height: string | undefined = this.height();

    if (svgFilePath !== undefined) {
      this.svgService.handleSvgFile(svgFilePath, this.ref).finally(() => {
        this.getSVGAfterInit(height, width);
      });
    }
  }

  getSVGAfterInit(height: string | undefined, width: string | undefined): void {
    const svg = this.ref.nativeElement.querySelector("svg");

    if (svg !== undefined) {

      if (height !== undefined) {
        svg.style.height = height;
      }

      if (width !== undefined) {
        svg.style.width = width;
      }
    }
  }

}
