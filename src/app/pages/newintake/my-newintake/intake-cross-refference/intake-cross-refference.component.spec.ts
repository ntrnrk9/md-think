import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeCrossRefferenceComponent } from './intake-cross-refference.component';

describe('IntakeCrossRefferenceComponent', () => {
  let component: IntakeCrossRefferenceComponent;
  let fixture: ComponentFixture<IntakeCrossRefferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeCrossRefferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeCrossRefferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
