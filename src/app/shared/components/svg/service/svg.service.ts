import { ElementRef, Injectable } from '@angular/core';
import { SVGBuilder } from './svg-builder';

@Injectable()
export class SvgService {
  private readonly _svgBuilder: SVGBuilder = new SVGBuilder();

  /**
   * Handle svg file
   *
   * @param filePath SVG file path
   * @param elRef
   */
  async handleSvgFile(filePath: string, elRef: ElementRef): Promise<void> {
    try {
      const getSvg = await this.fetchFile(filePath);
      const svgCleaned = this._svgBuilder.parseSVGString(getSvg);

      elRef.nativeElement.appendChild(svgCleaned);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  /**
   * Read SVG file content
   *
   * @param filePath
   * @private
   */
  private async fetchFile(filePath: string): Promise<string> {
    const request = await fetch(filePath, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
    return await request.text();
  }
}
