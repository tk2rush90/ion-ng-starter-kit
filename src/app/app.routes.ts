import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { WallListPageComponent } from './pages/wall-list-page/wall-list-page.component';
import { CommonWrapperPageComponent } from './pages/common-wrapper-page/common-wrapper-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CommonWrapperPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePageComponent,
      },
      {
        path: 'wall/list',
        component: WallListPageComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'notification',
        component: NotificationPageComponent,
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
      },
    ],
  },
];
