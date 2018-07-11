import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPeaceOrderAppealLetterComponent } from './pdf-peace-order-appeal-letter.component';

describe('PdfPeaceOrderAppealLetterComponent', () => {
  let component: PdfPeaceOrderAppealLetterComponent;
  let fixture: ComponentFixture<PdfPeaceOrderAppealLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfPeaceOrderAppealLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPeaceOrderAppealLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
