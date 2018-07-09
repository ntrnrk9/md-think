import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRecordComponent } from './image-record.component';

describe('ImageRecordComponent', () => {
  let component: ImageRecordComponent;
  let fixture: ComponentFixture<ImageRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
