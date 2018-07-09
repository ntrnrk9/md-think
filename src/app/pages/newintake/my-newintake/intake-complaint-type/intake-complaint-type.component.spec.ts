import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeComplaintTypeComponent } from './intake-complaint-type.component';

describe('IntakeComplaintTypeComponent', () => {
  let component: IntakeComplaintTypeComponent;
  let fixture: ComponentFixture<IntakeComplaintTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeComplaintTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeComplaintTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
