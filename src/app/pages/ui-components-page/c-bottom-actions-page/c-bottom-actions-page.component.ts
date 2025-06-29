import { Component } from '@angular/core';
import { CardComponent } from '../../../components/common/card/card.component';
import { BottomActionsComponent } from '../../../components/common/bottom-actions/bottom-actions.component';
import { FlatButtonDirective } from '../../../components/common/flat-button/flat-button.directive';
import { AsteriskIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-c-bottom-actions-page',
  imports: [
    CardComponent,
    BottomActionsComponent,
    FlatButtonDirective,
    LucideAngularModule,
  ],
  templateUrl: './c-bottom-actions-page.component.html',
  styleUrl: './c-bottom-actions-page.component.scss',
})
export class CBottomActionsPageComponent {
  protected readonly AsteriskIcon = AsteriskIcon;
}
