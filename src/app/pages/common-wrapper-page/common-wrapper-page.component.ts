import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/app/header/header.component';
import { SidebarComponent } from '../../components/app/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-common-wrapper-page',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './common-wrapper-page.component.html',
  styleUrl: './common-wrapper-page.component.scss',
})
export class CommonWrapperPageComponent {}
