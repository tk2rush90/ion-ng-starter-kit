import { Routes } from '@angular/router';
import { ExamplePageComponent } from './pages/example-page/example-page.component';

export const routes: Routes = [
  {
    path: 'example',
    component: ExamplePageComponent,
  },
  {
    path: '**',
    redirectTo: 'example',
  },
];
