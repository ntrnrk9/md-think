import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeServiceSubtypeComponent } from './intake-service-subtype.component';

describe('IntakeServiceSubtypeComponent', () => {
  let component: IntakeServiceSubtypeComponent;
  let fixture: ComponentFixture<IntakeServiceSubtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeServiceSubtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeServiceSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
