import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewintakeNarrativeComponent } from './newintake-narrative.component';

describe('NewintakeNarrativeComponent', () => {
  let component: NewintakeNarrativeComponent;
  let fixture: ComponentFixture<NewintakeNarrativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewintakeNarrativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewintakeNarrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
