import { Component } from '@angular/core';
import { CardComponent } from '../../../components/common/card/card.component';
import { BottomActionsComponent } from '../../../components/common/bottom-actions/bottom-actions.component';
import { ButtonDirective } from '../../../components/common/button/button.directive';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-c-bottom-actions-page',
  imports: [
    CardComponent,
    BottomActionsComponent,
    ButtonDirective,
    LucideAngularModule,
  ],
  templateUrl: './c-bottom-actions-page.component.html',
  styleUrl: './c-bottom-actions-page.component.scss',
})
export class CBottomActionsPageComponent {}
