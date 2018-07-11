import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CjamsPdfComponent } from './cjams-pdf.component';

describe('CjamsPdfComponent', () => {
  let component: CjamsPdfComponent;
  let fixture: ComponentFixture<CjamsPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CjamsPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CjamsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
