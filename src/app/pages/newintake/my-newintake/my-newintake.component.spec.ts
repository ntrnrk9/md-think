import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewintakeComponent } from './my-newintake.component';

describe('MyNewintakeComponent', () => {
  let component: MyNewintakeComponent;
  let fixture: ComponentFixture<MyNewintakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNewintakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNewintakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
