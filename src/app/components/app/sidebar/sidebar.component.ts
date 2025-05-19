import { Component, ViewEncapsulation } from '@angular/core';
import { IconHouseComponent } from '../../icons/icon-house/icon-house.component';
import { IconLayoutDashboardComponent } from '../../icons/icon-layout-dashboard/icon-layout-dashboard.component';
import { IconSearchComponent } from '../../icons/icon-search/icon-search.component';
import { IconBellComponent } from '../../icons/icon-bell/icon-bell.component';
import { IconSettingsComponent } from '../../icons/icon-settings/icon-settings.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppProfileService } from '../../../services/app/app-profile/app-profile.service';
import { AppProfileDto } from '../../../dto/app-profile-dto';

@Component({
  selector: 'app-sidebar',
  imports: [
    IconHouseComponent,
    IconLayoutDashboardComponent,
    IconSearchComponent,
    IconBellComponent,
    IconSettingsComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: {
    role: 'complementary',
  },
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  constructor(private readonly appProfileService: AppProfileService) {}

  get appProfile(): AppProfileDto | null {
    return this.appProfileService.data;
  }
}
