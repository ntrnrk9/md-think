import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeAttachmentsComponent } from './intake-attachments.component';

describe('IntakeAttachmentsComponent', () => {
  let component: IntakeAttachmentsComponent;
  let fixture: ComponentFixture<IntakeAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
