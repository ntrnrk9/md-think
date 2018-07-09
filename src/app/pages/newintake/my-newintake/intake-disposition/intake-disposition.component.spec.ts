import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeDispositionComponent } from './intake-disposition.component';

describe('IntakeDispositionComponent', () => {
  let component: IntakeDispositionComponent;
  let fixture: ComponentFixture<IntakeDispositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeDispositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeDispositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
