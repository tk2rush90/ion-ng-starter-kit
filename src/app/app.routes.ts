import { Routes } from '@angular/router';
import { UiComponentsPageComponent } from './pages/ui-components-page/ui-components-page.component';
import { CAutoFocusPageComponent } from './pages/ui-components-page/c-auto-focus-page/c-auto-focus-page.component';
import { CAutoResizerPageComponent } from './pages/ui-components-page/c-auto-resizer-page/c-auto-resizer-page.component';
import { CBottomActionsPageComponent } from './pages/ui-components-page/c-bottom-actions-page/c-bottom-actions-page.component';
import { CCalendarPageComponent } from './pages/ui-components-page/c-calendar-page/c-calendar-page.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { CBottomSheetPageComponent } from './pages/ui-components-page/c-bottom-sheet-page/c-bottom-sheet-page.component';
import { CButtonPageComponent } from './pages/ui-components-page/c-button-page/c-button-page.component';

export const routes: Routes = [
  {
    path: 'ui/components',
    component: UiComponentsPageComponent,
    children: [
      {
        path: 'autoFocus',
        component: CAutoFocusPageComponent,
      },
      {
        path: 'autoResizer',
        component: CAutoResizerPageComponent,
      },
      {
        path: 'bottomActions',
        component: CBottomActionsPageComponent,
      },
      {
        path: 'bottomSheet',
        component: CBottomSheetPageComponent,
      },
      {
        path: 'button',
        component: CButtonPageComponent,
      },
      {
        path: 'calendar',
        component: CCalendarPageComponent,
      },
      {
        path: '**',
        redirectTo: 'autoFocus',
      },
    ],
  },
  {
    path: 'example',
    component: ExamplePageComponent,
  },
  {
    path: '**',
    redirectTo: 'ui/components',
  },
];
