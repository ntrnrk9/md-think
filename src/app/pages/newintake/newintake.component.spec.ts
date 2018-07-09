import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewintakeComponent } from './newintake.component';

describe('NewintakeComponent', () => {
  let component: NewintakeComponent;
  let fixture: ComponentFixture<NewintakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewintakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewintakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
