import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeCommunicationsComponent } from './intake-communications.component';

describe('IntakeCommunicationsComponent', () => {
  let component: IntakeCommunicationsComponent;
  let fixture: ComponentFixture<IntakeCommunicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeCommunicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeCommunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
