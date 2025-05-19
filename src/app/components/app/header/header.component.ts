import { Component } from '@angular/core';
import { IconPiloLogoComponent } from '../../icons/icon-pilo-logo/icon-pilo-logo.component';
import { RouterLink } from '@angular/router';
import { IconFeatherComponent } from '../../icons/icon-feather/icon-feather.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { AppProfileService } from '../../../services/app/app-profile/app-profile.service';
import { AppProfileDto } from '../../../dto/app-profile-dto';
import { ProfileAvatarService } from '../../../services/app/profile-avatar/profile-avatar.service';

@Component({
  selector: 'app-header',
  imports: [
    IconPiloLogoComponent,
    RouterLink,
    IconFeatherComponent,
    AvatarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    role: 'banner',
  },
})
export class HeaderComponent {
  constructor(
    private readonly appProfileService: AppProfileService,
    private readonly profileAvatarService: ProfileAvatarService,
  ) {}

  get appProfile(): AppProfileDto | null {
    return this.appProfileService.data;
  }

  get avatar(): string | null {
    return this.profileAvatarService.data;
  }
}
