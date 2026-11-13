import { Nullable } from '@odyssea999/whiteboard';

export type KComponent = {
  /**
   * @description Component name
   */
  name: string;
  /**
   * @description Generated component content
   */
  content: string;
};

export type KComponentBuilder = {
  /**
   * @description Component name
   */
  name: string;
  /**
   * @description Component content
   */
  content: SVGElement;
};

const SVG_ATTRIBUTES_TO_REMOVE: Array<string> = [
  'width',
  'height',
  'xmlns',
  'id',
  'class',
  'style',
];

const SHAPE_ATTRIBUTES_TO_REMOVE: Array<string> = ['xmlns', 'id', 'class', 'style'];

const CHILDREN_TAG_TO_REMOVE: Array<string> = ['title', 'style', 'script'];

const SHAPE_TAGS = ['path', 'rect', 'circle', 'polygon', 'polyline', 'ellipse', 'line'];

const CONTAINER_TAG: Array<string> = ['g', 'defs', 'clipPath', 'mask'];

export class SVGBuilder {
  constructor() {}

  async parseSVG(data: Array<File> | File | FileList): Promise<Array<KComponentBuilder>> {
    let svgElements: Array<KComponentBuilder> = [];

    if (data instanceof FileList) {
      const files = data;

      if (files.length > 1) {
        for (const file of files) {
          const element: SVGElement = await this.dataParser(file);
          svgElements.push({
            name: this.extractFileName(file),
            content: element,
          });
        }

        return svgElements;
      }

      const file: Nullable<File> = data.item(0);

      if (file === null) {
        throw new Error('FileException : Cannot parse null file. please provide a valid SVG file');
      }

      const element: SVGElement = await this.dataParser(file);
      svgElements.push({
        name: this.extractFileName(file),
        content: element,
      });

      return svgElements;
    }

    if (data instanceof File) {
      const element: SVGElement = await this.dataParser(data);
      svgElements.push({
        content: element,
        name: this.extractFileName(data),
      });

      return svgElements;
    }

    for (const file of data) {
      const element: SVGElement = await this.dataParser(file);
      svgElements.push({
        content: element,
        name: this.extractFileName(file),
      });
    }

    return svgElements;
  }

  private removeAttributes(
    attributes: Array<string>,
    tag: Element,
    tagRawText: Nullable<string> = null,
  ): void {
    for (const attribute of attributes) {
      let isReferenced: boolean = false;
      if (attribute === 'id' && tagRawText !== null) {
        const IdValue: Nullable<string> = tag.getAttribute(attribute);

        if (IdValue !== null && IdValue !== '' && IdValue !== ' ') {
          isReferenced =
            tagRawText.includes(`url(#${IdValue})`) || tagRawText.includes(`href="#${IdValue}"`);
        }
      }

      if (!isReferenced) {
        tag.removeAttribute(attribute);
      }
    }
  }

  /**
   * @description Add necessary attribute
   * Here we have to force "fill" attribute, even if this one if not in the tag
   */
  private setAttributes(tag: Element): void {
    const stroke_attr: Nullable<string> = tag.getAttribute('stroke');

    const fill_attr: Nullable<string> = tag.getAttribute('fill');

    if (stroke_attr !== null && stroke_attr !== 'none') {
      tag.setAttribute('stroke', 'currentColor');
    }

    if (fill_attr === null || (fill_attr !== null && fill_attr !== 'none')) {
      tag.setAttribute('fill', 'currentColor');
    }
  }

  private extractFileName(file: File): string {
    const dotIndex: number = file.name.indexOf('.');
    return file.name.substring(0, dotIndex);
  }

  public parseSVGString(value: string): Nullable<SVGElement> {
    const domParser: DOMParser = new DOMParser();

    const domString = domParser.parseFromString(value, 'image/svg+xml' as DOMParserSupportedType);

    const svgTag: Nullable<SVGElement> = domString.getElementsByTagName('svg').item(0);

    if (svgTag !== null) {
      // Removing attributes fro <svg> tag
      this.removeAttributes(SVG_ATTRIBUTES_TO_REMOVE, svgTag);

      // Getting children that we need to be removed from the
      // <svg> tree
      const childdren = svgTag.querySelectorAll(CHILDREN_TAG_TO_REMOVE.join(','));

      // Here we remove each child
      // that we don't need in the final SVG format
      for (const child of childdren) {
        child.remove();
      }

      const shape_tag_children = svgTag.querySelectorAll(
        SHAPE_TAGS.concat(CONTAINER_TAG).join(','),
      );

      for (const shape of shape_tag_children) {
        this.setAttributes(shape);
        this.removeAttributes(SHAPE_ATTRIBUTES_TO_REMOVE, shape, value);
      }
    }

    return svgTag;
  }

  private async dataParser(file: File): Promise<SVGElement> {
    const domParser: DOMParser = new DOMParser();

    return new Promise(async (resolve, reject): Promise<void> => {
      file
        .text()
        .then((value: string): void => {
          const domString = domParser.parseFromString(value, file.type as DOMParserSupportedType);

          const svgTag: Nullable<SVGElement> = domString.getElementsByTagName('svg').item(0);

          if (svgTag !== null) {
            // Removing attributes fro <svg> tag
            this.removeAttributes(SVG_ATTRIBUTES_TO_REMOVE, svgTag);

            // Getting children that we need to be removed from the
            // <svg> tree
            const childdren = svgTag.querySelectorAll(CHILDREN_TAG_TO_REMOVE.join(','));

            // Here we remove each child
            // that we don't need in the final SVG format
            for (const child of childdren) {
              child.remove();
            }

            const shape_tag_children = svgTag.querySelectorAll(
              SHAPE_TAGS.concat(CONTAINER_TAG).join(','),
            );

            for (const shape of shape_tag_children) {
              this.setAttributes(shape);
              this.removeAttributes(SHAPE_ATTRIBUTES_TO_REMOVE, shape, value);
            }
            resolve(svgTag);
          }
        })
        .catch((error): void => {
          reject('FileException : Could not get SVG content');
          throw new Error(error);
        });
    });
  }
}
