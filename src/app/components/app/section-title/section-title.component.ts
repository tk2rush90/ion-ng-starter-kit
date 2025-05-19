import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-section-title',
  imports: [],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'heading',
  },
})
export class SectionTitleComponent {}
