import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSaveintakeComponent } from './new-saveintake.component';

describe('NewSaveintakeComponent', () => {
  let component: NewSaveintakeComponent;
  let fixture: ComponentFixture<NewSaveintakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSaveintakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSaveintakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
