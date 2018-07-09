import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeEntitiesComponent } from './intake-entities.component';

describe('IntakeEntitiesComponent', () => {
  let component: IntakeEntitiesComponent;
  let fixture: ComponentFixture<IntakeEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
