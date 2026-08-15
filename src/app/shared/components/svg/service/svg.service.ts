import {ElementRef, Injectable} from "@angular/core";

@Injectable()
export class SvgService {

  /**
   * Handle svg file
   *
   * @param filePath SVG file path
   * @param elRef
   */
  async handleSvgFile(filePath: string, elRef: ElementRef): Promise<void> {
    try {
      const getSvg = await this.fetchFile(filePath);
      elRef.nativeElement.insertAdjacentHTML("beforeend", getSvg);
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
        "Content-Type": "image/svg+xml"
      }
    })
    return await request.text();
  }
}
