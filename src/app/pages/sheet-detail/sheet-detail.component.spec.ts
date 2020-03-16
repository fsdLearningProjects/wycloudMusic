import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDetailComponent } from './sheet-detail.component';

describe('SheetDetailComponent', () => {
  let component: SheetDetailComponent;
  let fixture: ComponentFixture<SheetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
