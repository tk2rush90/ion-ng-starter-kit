import { Renderer2 } from '@angular/core';

export class StaticImageNodeView {
  dom: HTMLElement;
  image: HTMLImageElement;
  caption?: HTMLElement;
  text?: Text;

  constructor(
    private readonly renderer: Renderer2,
    element: HTMLImageElement,
  ) {
    this.dom = this.renderer.createElement('div');
    this.image = this.renderer.createElement('img');

    this.renderer.setAttribute(this.image, 'src', element.src);
    this.renderer.setAttribute(this.image, 'alt', element.alt);
    this.renderer.setAttribute(this.image, 'title', element.title);
    this.renderer.setAttribute(this.image, 'loading', 'lazy');

    this.renderer.appendChild(this.dom, this.image);
    this.renderCaption();
  }

  renderCaption(): void {
    this.text?.remove();
    this.caption?.remove();

    if (this.image.alt) {
      this.caption = this.renderer.createElement('div');

      this.renderer.addClass(this.caption, 'text-center');
      this.renderer.addClass(this.caption, 'text-base');
      this.renderer.addClass(this.caption, 'md:text-lg');
      this.renderer.addClass(this.caption, 'text-gray-400');
      this.renderer.addClass(this.caption, 'break-all');
      this.renderer.addClass(this.caption, 'mb-8');

      this.text = this.renderer.createText(this.image.alt);

      this.renderer.appendChild(this.caption, this.text);
      this.renderer.appendChild(this.dom, this.caption);
    }

    if (this.caption) {
      this.dom.classList.add('prose-img:mb-1');
    } else {
      this.dom.classList.remove('prose-img:mb-1');
    }
  }
}
