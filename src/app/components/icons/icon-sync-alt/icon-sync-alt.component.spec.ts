import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSyncAltComponent } from './icon-sync-alt.component';

describe('IconSyncAltComponent', () => {
  let component: IconSyncAltComponent;
  let fixture: ComponentFixture<IconSyncAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSyncAltComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSyncAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
