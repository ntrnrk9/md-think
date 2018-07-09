import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeAssessmentComponent } from './intake-assessment.component';

describe('IntakeAssessmentComponent', () => {
  let component: IntakeAssessmentComponent;
  let fixture: ComponentFixture<IntakeAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
