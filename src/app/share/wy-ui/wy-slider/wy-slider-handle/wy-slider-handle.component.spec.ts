import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WySliderHandleComponent } from './wy-slider-handle.component';

describe('WySliderHandleComponent', () => {
  let component: WySliderHandleComponent;
  let fixture: ComponentFixture<WySliderHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WySliderHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WySliderHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
