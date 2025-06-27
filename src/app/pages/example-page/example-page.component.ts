import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  TemplateRef,
  viewChildren,
} from '@angular/core';
import { CheckboxComponent } from '../../components/common/checkbox/checkbox.component';
import { BackdropComponent } from '../../components/common/backdrop/backdrop.component';
import { BottomSheetComponent } from '../../components/common/bottom-sheet/bottom-sheet.component';
import {
  OverlayOptions,
  OverlayService,
} from '../../services/app/overlay/overlay.service';
import { fadeInOut } from '../../animations/fade-in-out';
import { slideInOutBottomFull } from '../../animations/slide-in-out-bottom-full';
import { FlatButtonDirective } from '../../components/common/flat-button/flat-button.directive';
import { ConfirmComponent } from '../../components/common/confirm/confirm.component';
import { ModalComponent } from '../../components/common/modal/modal.component';
import { FileHandlerDirective } from '../../components/common/file-handler/file-handler.directive';
import { KB, MB } from '../../constants/size';
import { ToastService } from '../../services/app/toast/toast.service';
import { FormFieldComponent } from '../../components/common/form-field/form-field.component';
import { AutoResizerDirective } from '../../components/common/auto-resizer/auto-resizer.directive';
import { FieldHintComponent } from '../../components/common/form-field/field-hint/field-hint.component';
import { FieldErrorComponent } from '../../components/common/form-field/field-error/field-error.component';
import { GoogleOauthButtonComponent } from '../../components/common/google-oauth-button/google-oauth-button.component';
import { RadioGroupComponent } from '../../components/common/radio-group/radio-group.component';
import { RadioComponent } from '../../components/common/radio-group/radio/radio.component';
import { FieldComponent } from '../../components/common/field/field.component';
import { SpinnerComponent } from '../../components/common/spinner/spinner.component';
import { WysiwygEditorComponent } from '../../components/common/wysiwyg-editor/wysiwyg-editor.component';
import { WysiwygEditorActionsComponent } from '../../components/common/wysiwyg-editor-actions/wysiwyg-editor-actions.component';
import { ProseMirrorEditorService } from '../../services/app/prose-mirror-editor/prose-mirror-editor.service';
import {
  createDefaultEditorState,
  defaultSchema,
} from '../../utils/prosemirror.utils';
import { CardComponent } from '../../components/common/card/card.component';
import { ImeInputDirective } from '../../components/common/ime-input/ime-input.directive';
import { BottomActionsComponent } from '../../components/common/bottom-actions/bottom-actions.component';
import { createDraggable } from 'animejs';
import { AngularPlatform } from '../../utils/platform.utils';
import { MessageOverlayComponent } from '../../components/common/message-overlay/message-overlay.component';
import {
  AppWindowIcon,
  BugIcon,
  CircleAlertIcon,
  GridIcon,
  LucideAngularModule,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  PartyPopperIcon,
} from 'lucide-angular';
import { SideBarContainerComponent } from '../../components/common/side-bar-container/side-bar-container.component';
import { SideBarComponent } from '../../components/common/side-bar/side-bar.component';
import { IconButtonDirective } from '../../components/common/icon-button/icon-button.directive';
import { SideBarOverlayComponent } from '../../components/common/side-bar-overlay/side-bar-overlay.component';
import { ChipComponent } from '../../components/common/chip/chip.component';
import { TabContainerComponent } from '../../components/common/tab-container/tab-container.component';
import { TabItemDirective } from '../../components/common/tab-item/tab-item.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImageComponent } from '../../components/common/image/image.component';
import { CalendarComponent } from '../../components/common/calendar/calendar.component';

@Component({
  selector: 'app-example-page',
  imports: [
    CheckboxComponent,
    BackdropComponent,
    BottomSheetComponent,
    FlatButtonDirective,
    ConfirmComponent,
    ModalComponent,
    FileHandlerDirective,
    FormFieldComponent,
    AutoResizerDirective,
    FieldHintComponent,
    FieldErrorComponent,
    GoogleOauthButtonComponent,
    RadioGroupComponent,
    RadioComponent,
    FieldComponent,
    SpinnerComponent,
    WysiwygEditorComponent,
    WysiwygEditorActionsComponent,
    CardComponent,
    ImeInputDirective,
    BottomActionsComponent,
    MessageOverlayComponent,
    LucideAngularModule,
    SideBarContainerComponent,
    SideBarComponent,
    IconButtonDirective,
    SideBarOverlayComponent,
    ChipComponent,
    TabContainerComponent,
    TabItemDirective,
    RouterLinkActive,
    RouterLink,
    ImageComponent,
    CalendarComponent,
  ],
  templateUrl: './example-page.component.html',
  styleUrl: './example-page.component.scss',
  animations: [fadeInOut(), slideInOutBottomFull()],
  host: {
    class:
      'flex min-h-dvh flex-col items-stretch gap-4 grow shrink-0 h-auto basis-auto',
  },
  providers: [ProseMirrorEditorService],
})
export class ExamplePageComponent implements AfterViewInit {
  editorState = createDefaultEditorState(defaultSchema, {
    placeholder: '어떤 생각을 하고 계신가요?',
  });

  draggableList = viewChildren('draggable', {
    read: ElementRef,
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly overlayService = inject(OverlayService);

  private readonly toastService = inject(ToastService);

  ngAfterViewInit() {
    if (AngularPlatform.isBrowser) {
      this.draggableList().forEach((draggableElementRef) =>
        createDraggable(draggableElementRef.nativeElement, {
          container: '.draggable-container',
        }),
      );
    }
  }

  openOverlay(
    templateRef: TemplateRef<any> | null,
    options: Omit<OverlayOptions, 'destroyRef'> = {},
  ): void {
    if (templateRef) {
      this.overlayService.open(templateRef, {
        destroyRef: this.destroyRef,
        ...options,
      });
    }
  }

  openToast(message: string): void {
    this.toastService.open({
      message,
    });
  }

  fileOrFilesChange(fileOrFiles: File | File[]): void {
    console.log(fileOrFiles);
  }

  protected readonly MB = MB;
  protected readonly KB = KB;
  protected readonly CircleAlertIcon = CircleAlertIcon;
  protected readonly PartyPopperIcon = PartyPopperIcon;
  protected readonly BugIcon = BugIcon;
  protected readonly PanelLeftCloseIcon = PanelLeftCloseIcon;
  protected readonly PanelLeftOpenIcon = PanelLeftOpenIcon;
  protected readonly PanelRightCloseIcon = PanelRightCloseIcon;
  protected readonly PanelRightOpenIcon = PanelRightOpenIcon;
  protected readonly GridIcon = GridIcon;
  protected readonly AppWindowIcon = AppWindowIcon;
}
