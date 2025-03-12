import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSyncComponent } from './icon-sync.component';

describe('IconSyncComponent', () => {
  let component: IconSyncComponent;
  let fixture: ComponentFixture<IconSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSyncComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
