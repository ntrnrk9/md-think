import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakePersonsInvolvedComponent } from './intake-persons-involved.component';

describe('IntakePersonsInvolvedComponent', () => {
  let component: IntakePersonsInvolvedComponent;
  let fixture: ComponentFixture<IntakePersonsInvolvedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakePersonsInvolvedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakePersonsInvolvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
