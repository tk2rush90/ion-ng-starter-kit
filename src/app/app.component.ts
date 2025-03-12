import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from './components/common/checkbox/checkbox.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, FormsModule, IonRouterOutlet, CheckboxComponent],
})
export class AppComponent {
  constructor() {}
}
