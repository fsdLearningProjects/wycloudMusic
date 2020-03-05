import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WySliderTrackComponent } from './wy-slider-track.component';

describe('WySliderTrackComponent', () => {
  let component: WySliderTrackComponent;
  let fixture: ComponentFixture<WySliderTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WySliderTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WySliderTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
