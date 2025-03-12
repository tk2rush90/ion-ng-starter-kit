import { Renderer2 } from '@angular/core';

export class StaticYoutubeEmbedNodeView {
  dom: HTMLElement;
  iframe: HTMLIFrameElement;

  constructor(
    private readonly renderer: Renderer2,
    element: HTMLIFrameElement,
  ) {
    this.dom = this.renderer.createElement('div');
    this.iframe = this.renderer.createElement('iframe');

    this.renderer.setAttribute(this.iframe, 'src', element.src);
    this.renderer.setAttribute(this.iframe, 'allowfullscreen', '');
    this.renderer.setStyle(this.iframe, 'border', 'none');

    this.renderer.appendChild(this.dom, this.iframe);
  }
}
