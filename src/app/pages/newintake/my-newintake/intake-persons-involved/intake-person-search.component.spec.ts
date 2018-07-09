import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakePersonSearchComponent } from './intake-person-search.component';

describe('IntakePersonSearchComponent', () => {
  let component: IntakePersonSearchComponent;
  let fixture: ComponentFixture<IntakePersonSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakePersonSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakePersonSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
