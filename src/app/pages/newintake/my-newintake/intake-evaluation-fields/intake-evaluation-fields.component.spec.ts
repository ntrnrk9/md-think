import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeEvaluationFieldsComponent } from './intake-evaluation-fields.component';

describe('IntakeEvaluationFieldsComponent', () => {
  let component: IntakeEvaluationFieldsComponent;
  let fixture: ComponentFixture<IntakeEvaluationFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeEvaluationFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeEvaluationFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
