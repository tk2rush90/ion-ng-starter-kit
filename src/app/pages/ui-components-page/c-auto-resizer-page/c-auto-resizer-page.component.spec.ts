import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAutoResizerPageComponent } from './c-auto-resizer-page.component';

describe('CAutoResizerPageComponent', () => {
  let component: CAutoResizerPageComponent;
  let fixture: ComponentFixture<CAutoResizerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CAutoResizerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAutoResizerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
