import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSyncDisabledComponent } from './icon-sync-disabled.component';

describe('IconSyncDisabledComponent', () => {
  let component: IconSyncDisabledComponent;
  let fixture: ComponentFixture<IconSyncDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSyncDisabledComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSyncDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
