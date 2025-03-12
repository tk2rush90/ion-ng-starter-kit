import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-wysiwyg-editor-button',
  imports: [],
  templateUrl: './wysiwyg-editor-button.component.html',
  styleUrl: './wysiwyg-editor-button.component.scss',
})
export class WysiwygEditorButtonComponent {
  @Output() clickButton = new EventEmitter<void>();
}
